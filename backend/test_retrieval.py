from app.services.rag_retrieval_service import rag_service

print("Testing Doctor Retrieval (Myocardial Infarction)...")
doctor_results = rag_service.retrieve_doctor_guidelines("Anterior Myocardial Infarction", top_k=2)
for i, res in enumerate(doctor_results, 1):
    print(f"\n--- [Doctor Citation {i}] ({res['source']}) ---")
    print(res["text"][:250] + "...")

print("\nTesting Patient Retrieval (Atrial Fibrillation)...")
patient_results = rag_service.retrieve_patient_guidance("Atrial Fibrillation", top_k=1)
for res in patient_results:
    print(f"\n--- [Patient Guidance] ({res['source']}) ---")
    print(res["text"][:250] + "...")

print("\nTesting SCP Statement Lookup (IMI)...")
scp_info = rag_service.lookup_scp_statement("IMI")
print(scp_info)