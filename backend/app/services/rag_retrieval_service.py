import os
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.utils import embedding_functions
import logging

logger = logging.getLogger("rag_retrieval")

CHROMA_PERSIST_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../chroma_db")
)
COLLECTION_NAME = "cardiology_clinical_rag"


class CardiologyRAGService:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=self.embedding_fn
        )

    def retrieve_doctor_guidelines(
        self, diagnosis_term: str, top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Retrieves technical electrophysiological criteria and citations
        from Chou's and Marriott's for the clinical workstation.
        """
        try:
            results = self.collection.query(
                query_texts=[f"Diagnostic criteria electrophysiology vector territory {diagnosis_term}"],
                n_results=top_k,
                where={"role_target": {"$in": ["DOCTOR", "BOTH"]}}
            )

            citations = []
            if results and results.get("documents") and len(results["documents"][0]) > 0:
                for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                    citations.append({
                        "source": meta.get("source", "Clinical Cardiology Reference"),
                        "text": doc.strip()
                    })
            return citations
        except Exception as e:
            logger.error(f"Doctor RAG retrieval failed: {e}")
            return []

    def retrieve_patient_guidance(
        self, diagnosis_term: str, top_k: int = 2
    ) -> List[Dict[str, Any]]:
        """
        Retrieves patient-friendly explanations, symptoms, and urgency action
        guidance from Goldberger's.
        """
        try:
            results = self.collection.query(
                query_texts=[f"Patient clinical understanding symptoms urgency care {diagnosis_term}"],
                n_results=top_k,
                where={"role_target": {"$in": ["PATIENT", "BOTH"]}}
            )

            guidance = []
            if results and results.get("documents") and len(results["documents"][0]) > 0:
                for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                    guidance.append({
                        "source": meta.get("source", "Goldberger's Clinical Electrocardiography"),
                        "text": doc.strip()
                    })
            return guidance
        except Exception as e:
            logger.error(f"Patient RAG retrieval failed: {e}")
            return []

    def lookup_scp_statement(self, scp_code: str) -> Optional[Dict[str, Any]]:
        """
        Direct lookup for PTB-XL diagnostic code definitions.
        """
        try:
            results = self.collection.query(
                query_texts=[f"SCP Diagnostic Code: {scp_code}"],
                n_results=1,
                where={"type": "diagnostic_dictionary"}
            )
            if results and results.get("documents") and len(results["documents"][0]) > 0:
                return {
                    "code": scp_code,
                    "definition": results["documents"][0][0].strip()
                }
            return None
        except Exception as e:
            logger.error(f"SCP statement lookup failed for {scp_code}: {e}")
            return None


# Global singleton instance
rag_service = CardiologyRAGService()