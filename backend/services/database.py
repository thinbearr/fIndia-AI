"""
MongoDB Database Service
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        db_instance.client = AsyncIOMotorClient(mongo_uri)
        db_instance.db = db_instance.client.findia_ai
        
        # Test connection
        await db_instance.client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Create indexes
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.watchlists.create_index([("user_id", 1), ("ticker", 1)], unique=True)
        await db_instance.db.stocks.create_index("ticker", unique=True)
        
    except ConnectionFailure as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if db_instance.client:
        db_instance.client.close()
        print("✅ Closed MongoDB connection")

def get_database():
    """Get database instance"""
    return db_instance.db
