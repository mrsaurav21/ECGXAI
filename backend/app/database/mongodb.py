import logging
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("uvicorn")


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_instance = Database()


async def connect_to_mongo():
    """Initializes Motor client with Atlas connection string and builds required indexes."""
    logger.info("Initializing connection to MongoDB Atlas...")
    try:
        # Pass certifi CA file and relaxed TLS parameters for reliable Windows Atlas handshakes
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,  # Bypasses local SSL inspection / internal alert issues
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
        )
        db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]

        # Ping the cluster to verify valid connection credentials
        await db_instance.db.command("ping")
        logger.info("MongoDB Atlas ping successful.")

        # 1. Unique index on user email
        await db_instance.db["users"].create_index("email", unique=True)

        # 2. TTL auto-expiring index on OTP collection (5 minutes / 300 seconds)
        await db_instance.db["otps"].create_index("created_at", expireAfterSeconds=300)

        # 3. Unique index on patient medical record number (MRN)
        await db_instance.db["patients"].create_index("patient_mrn", unique=True)

        # 4. Compound index on ecg_records for rapid longitudinal timeline queries
        await db_instance.db["ecg_records"].create_index(
            [("patient_mrn", 1), ("recorded_at", -1)]
        )

        logger.info("All MongoDB collections and indexes initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB Atlas: {str(e)}")
        raise e


async def close_mongo_connection():
    """Gracefully closes the Motor connection pool."""
    logger.info("Closing MongoDB Atlas connection...")
    if db_instance.client:
        db_instance.client.close()
    logger.info("MongoDB Atlas connection closed.")


def get_database():
    """Dependency provider returning the active MongoDB database object."""
    return db_instance.db