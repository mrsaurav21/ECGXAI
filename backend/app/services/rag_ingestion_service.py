import os
import glob
import pandas as pd
from typing import List, Dict, Any
from pypdf import PdfReader
import chromadb
from chromadb.utils import embedding_functions
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag_ingestion")

CHROMA_PERSIST_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../chroma_db")
)
DATASET_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../dataset")
)
COLLECTION_NAME = "cardiology_clinical_rag"


def get_chroma_client():
    """Returns a persistent ChromaDB client saving directly to disk."""
    os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)
    return chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)


def get_embedding_function():
    """Standard local sentence transformer for offline embeddings."""
    return embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )


def extract_chunks_from_pdf(
    pdf_path: str, book_key: str, role_target: str, chunk_size: int = 1000, overlap: int = 150
) -> List[Dict[str, Any]]:
    """Extracts text from PDF and splits into overlapping chunks with metadata."""
    logger.info(f"Extracting text from: {os.path.basename(pdf_path)}")
    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        logger.error(f"Failed to read PDF {pdf_path}: {e}")
        return []

    total_pages = len(reader.pages)
    full_text = []

    for idx, page in enumerate(reader.pages):
        try:
            text = page.extract_text()
            if text and len(text.strip()) > 50:
                full_text.append(text)
        except Exception:
            continue

    combined_text = "\n".join(full_text)
    chunks = []
    start = 0

    while start < len(combined_text):
        end = start + chunk_size
        chunk_str = combined_text[start:end].strip()

        if len(chunk_str) > 100:
            chunks.append({
                "text": chunk_str,
                "metadata": {
                    "source": book_key,
                    "role_target": role_target,
                    "type": "textbook"
                }
            })
        start += chunk_size - overlap

    logger.info(f"Generated {len(chunks)} chunks from {os.path.basename(pdf_path)} ({total_pages} pages).")
    return chunks


def extract_ptbxl_statements(csv_path: str) -> List[Dict[str, Any]]:
    """Ingests SCP statements dictionary into structured clinical chunks."""
    if not os.path.exists(csv_path):
        logger.warning(f"SCP statements CSV not found at {csv_path}")
        return []

    try:
        df = pd.read_csv(csv_path, index_col=0)
    except Exception as e:
        logger.error(f"Failed to read SCP CSV: {e}")
        return []

    chunks = []
    for code, row in df.iterrows():
        description = row.get("description", "")
        diagnostic_class = row.get("diagnostic_class", "UNKNOWN")
        statement_category = row.get("statement_category", "")

        entry_text = (
            f"SCP Diagnostic Code: {code}. Category: {statement_category}. "
            f"Superclass: {diagnostic_class}. Clinical Description: {description}."
        )

        chunks.append({
            "text": entry_text,
            "metadata": {
                "source": "PTB-XL_SCP_Statements",
                "role_target": "BOTH",
                "scp_code": str(code),
                "type": "diagnostic_dictionary"
            }
        })

    logger.info(f"Generated {len(chunks)} definition chunks from scp_statements.csv.")
    return chunks


def build_vector_store_if_needed(force_reindex: bool = False):
    """
    Checks if ChromaDB already has records.
    If yes, skips parsing.
    If no or forced, executes ingestion once.
    """
    client = get_chroma_client()
    embedding_fn = get_embedding_function()

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn
    )

    existing_count = collection.count()
    if existing_count > 0 and not force_reindex:
        logger.info(
            f"ChromaDB collection '{COLLECTION_NAME}' already initialized with {existing_count} chunks. Skipping ingestion."
        )
        return

    logger.info("ChromaDB is empty or force_reindex=True. Running one-time ingestion pipeline...")

    all_chunks: List[Dict[str, Any]] = []

    # 1. Parse PTB-XL scp_statements.csv if present
    scp_path = os.path.join(DATASET_DIR, "ptbxl", "scp_statements.csv")
    if not os.path.exists(scp_path):
        # Alternative path directly under dataset
        alt_scp = os.path.join(DATASET_DIR, "scp_statements.csv")
        if os.path.exists(alt_scp):
            scp_path = alt_scp

    all_chunks.extend(extract_ptbxl_statements(scp_path))

    # 2. Parse the 3 Clinical Textbooks
    pdf_files = glob.glob(os.path.join(DATASET_DIR, "*.pdf"))
    if not pdf_files:
        # Check subdirectories of dataset if structured
        pdf_files = glob.glob(os.path.join(DATASET_DIR, "**", "*.pdf"), recursive=True)

    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file).lower()
        if "chou" in filename:
            book_key = "Chou's Electrocardiography in Clinical Practice"
            role = "DOCTOR"
        elif "marriott" in filename:
            book_key = "Marriott's Practical Electrocardiography"
            role = "DOCTOR"
        elif "goldberger" in filename:
            book_key = "Goldberger's Clinical Electrocardiography"
            role = "PATIENT"
        else:
            book_key = filename
            role = "BOTH"

        chunks = extract_chunks_from_pdf(pdf_file, book_key, role)
        all_chunks.extend(chunks)

    if not all_chunks:
        logger.warning(f"No PDFs or CSV found in dataset directory: {DATASET_DIR}")
        return

    # Ingest in batches into ChromaDB
    batch_size = 100
    total_chunks = len(all_chunks)
    logger.info(f"Writing {total_chunks} embeddings into persistent ChromaDB at {CHROMA_PERSIST_DIR}...")

    for i in range(0, total_chunks, batch_size):
        batch = all_chunks[i:i + batch_size]
        ids = [f"chunk_{i + idx}" for idx in range(len(batch))]
        documents = [b["text"] for b in batch]
        metadatas = [b["metadata"] for b in batch]

        collection.upsert(ids=ids, documents=documents, metadatas=metadatas)

    logger.info(f"One-time ingestion complete. Total records stored: {collection.count()}.")


if __name__ == "__main__":
    build_vector_store_if_needed(force_reindex=False)