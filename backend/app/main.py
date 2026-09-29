from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.api import auth, ecg  # <-- imported ecg router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(ecg.router, prefix=settings.API_V1_STR)  # <-- registered here

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "database": "MongoDB Atlas Async (Motor)"
    }