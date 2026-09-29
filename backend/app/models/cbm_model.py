import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, Any, Tuple, List


CONCEPT_NAMES: List[str] = [
    "heart_rate_bpm",
    "pr_interval_ms",
    "qrs_duration_ms",
    "qtc_interval_ms",
    "st_dev_I",
    "st_dev_II",
    "st_dev_III",
    "st_dev_aVR",
    "st_dev_aVL",
    "st_dev_aVF",
    "st_dev_V1",
    "st_dev_V2",
    "st_dev_V3",
    "st_dev_V4",
    "st_dev_V5",
    "st_dev_V6",
]

DIAGNOSTIC_CLASSES: List[str] = ["NORM", "MI", "STTC", "CD", "HYP"]


class SEBlock1D(nn.Module):
    """1D Squeeze-and-Excitation channel attention block."""
    def __init__(self, channels: int, reduction: int = 4):
        super().__init__()
        self.fc = nn.Sequential(
            nn.AdaptiveAvgPool1d(1),
            nn.Flatten(),
            nn.Linear(channels, max(channels // reduction, 8)),
            nn.ReLU(inplace=True),
            nn.Linear(max(channels // reduction, 8), channels),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        b, c, _ = x.size()
        weights = self.fc(x).view(b, c, 1)
        return x * weights


class ResidualSEBlock1D(nn.Module):
    """Residual convolutional block with SE attention."""
    def __init__(self, in_channels: int, out_channels: int, stride: int = 1):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels, out_channels, kernel_size=7, stride=stride, padding=3, bias=False)
        self.bn1 = nn.BatchNorm1d(out_channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv1d(out_channels, out_channels, kernel_size=7, stride=1, padding=3, bias=False)
        self.bn2 = nn.BatchNorm1d(out_channels)
        self.se = SEBlock1D(out_channels)

        self.downsample = None
        if stride != 1 or in_channels != out_channels:
            self.downsample = nn.Sequential(
                nn.Conv1d(in_channels, out_channels, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm1d(out_channels)
            )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        residual = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out = self.se(out)

        if self.downsample is not None:
            residual = self.downsample(x)

        out += residual
        return self.relu(out)


class MacroRhythmEncoder(nn.Module):
    """
    Stream A: Dilated 1D convolutions for 10-second continuous strips (12, 5000).
    Receptive field scales exponentially to capture rhythm, pauses, and AV intervals.
    """
    def __init__(self, in_channels: int = 12, out_features: int = 128):
        super().__init__()
        self.initial_conv = nn.Sequential(
            nn.Conv1d(in_channels, 32, kernel_size=15, stride=2, padding=7, bias=False),
            nn.BatchNorm1d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool1d(kernel_size=2)
        )

        self.dilated_layers = nn.ModuleList([
            nn.Sequential(
                nn.Conv1d(32, 64, kernel_size=7, dilation=2, padding=6, bias=False),
                nn.BatchNorm1d(64),
                nn.ReLU(inplace=True),
                nn.MaxPool1d(2)
            ),
            nn.Sequential(
                nn.Conv1d(64, 128, kernel_size=7, dilation=4, padding=12, bias=False),
                nn.BatchNorm1d(128),
                nn.ReLU(inplace=True),
                nn.MaxPool1d(2)
            ),
            nn.Sequential(
                nn.Conv1d(128, out_features, kernel_size=7, dilation=8, padding=24, bias=False),
                nn.BatchNorm1d(out_features),
                nn.ReLU(inplace=True),
                nn.AdaptiveAvgPool1d(1)
            )
        ])

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.initial_conv(x)
        for layer in self.dilated_layers:
            out = layer(out)
        return torch.flatten(out, 1)


class MicroMorphologyEncoder(nn.Module):
    """
    Stream B: SE-ResNet for median beat morphology (12, 512).
    Captures fine waveform variations (ST elevation/depression, QRS duration, Q waves).
    """
    def __init__(self, in_channels: int = 12, out_features: int = 128):
        super().__init__()
        self.prep = nn.Sequential(
            nn.Conv1d(in_channels, 32, kernel_size=7, stride=2, padding=3, bias=False),
            nn.BatchNorm1d(32),
            nn.ReLU(inplace=True)
        )
        self.layer1 = ResidualSEBlock1D(32, 64, stride=2)
        self.layer2 = ResidualSEBlock1D(64, 128, stride=2)
        self.layer3 = ResidualSEBlock1D(128, out_features, stride=2)
        self.pool = nn.AdaptiveAvgPool1d(1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out = self.prep(x)
        out = self.layer1(out)
        out = self.layer2(out)
        out = self.layer3(out)
        out = self.pool(out)
        return torch.flatten(out, 1)


class DualStreamCBM(nn.Module):
    """
    Dual-Stream Concept Bottleneck Model.
    Architecture:
      Stream A (12x5000) + Stream B (12x512) -> Fused Latent -> Concept Layer -> Linear Diagnostic Head
    """
    def __init__(
        self,
        num_concepts: int = len(CONCEPT_NAMES),
        num_classes: int = len(DIAGNOSTIC_CLASSES),
        feature_dim: int = 128
    ):
        super().__init__()
        self.num_concepts = num_concepts
        self.num_classes = num_classes

        # Encoders
        self.macro_encoder = MacroRhythmEncoder(in_channels=12, out_features=feature_dim)
        self.micro_encoder = MicroMorphologyEncoder(in_channels=12, out_features=feature_dim)

        # Bottleneck Projector
        fused_dim = feature_dim * 2
        self.bottleneck_projector = nn.Sequential(
            nn.Linear(fused_dim, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.2),
            nn.Linear(128, num_concepts)
        )

        # Interpretable Linear Classification Head: strictly linear mapping without hidden layers
        self.diagnostic_head = nn.Linear(num_concepts, num_classes, bias=True)

    def forward(
        self, stream_a: torch.Tensor, stream_b: torch.Tensor
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Forward pass.
        Returns:
            logits: (batch_size, num_classes)
            concepts: (batch_size, num_concepts)
        """
        feat_a = self.macro_encoder(stream_a)
        feat_b = self.micro_encoder(stream_b)
        fused = torch.cat([feat_a, feat_b], dim=1)

        predicted_concepts = self.bottleneck_projector(fused)
        logits = self.diagnostic_head(predicted_concepts)
        return logits, predicted_concepts

    def explain_prediction(
        self, concepts: torch.Tensor, class_idx: int
    ) -> List[Dict[str, Any]]:
        """
        Calculates exact linear attributions for a given diagnostic class:
            Attribution_j = W_{class_idx, j} * Concept_j
        """
        weights = self.diagnostic_head.weight[class_idx].detach().cpu().numpy()
        concept_vals = concepts.squeeze(0).detach().cpu().numpy()

        attributions = []
        for name, weight, val in zip(CONCEPT_NAMES, weights, concept_vals):
            attribution_score = float(weight * val)
            attributions.append({
                "concept": name,
                "value": float(round(val, 2)),
                "weight": float(round(weight, 4)),
                "attribution": float(round(attribution_score, 4))
            })

        # Sort by absolute impact
        attributions.sort(key=lambda x: abs(x["attribution"]), reverse=True)
        return attributions