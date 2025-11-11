#!/usr/bin/env python3
"""
Test script to verify MongoDB connection and data
"""

import os
import pymongo
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mongodb():
    """Test MongoDB connection and verify data"""

    MONGO_URI = os.getenv('MONGO_URI')
    if not MONGO_URI:
        print("❌ MONGO_URI not found in .env file")
        return False

    try:
        print("🔄 Testing MongoDB connection...")
        client = pymongo.MongoClient(MONGO_URI)

        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")

        # Access database
        db = client['venue_db']

        # Test collections
        venues_collection = db['venues']
        event_planners_collection = db['event_planners']

        # Count documents
        venue_count = venues_collection.count_documents({})
        planner_count = event_planners_collection.count_documents({})

        print(f"✅ Found {venue_count} venues")
        print(f"✅ Found {planner_count} event planners")

        # Test sample queries
        print("\n🏨 Sample venues:")
        venues = list(venues_collection.find().limit(3))
        for venue in venues:
            print(f"  - {venue.get('name', 'Unknown')} ({venue.get('location', 'Unknown')})")

        print("\n🎯 Sample event planners:")
        planners = list(event_planners_collection.find().limit(3))
        for planner in planners:
            print(f"  - {planner.get('name', 'Unknown')} ({planner.get('city', 'Unknown')})")

        print("\n🎉 MongoDB test completed successfully!")
        return True

    except Exception as e:
        print(f"❌ MongoDB test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 MongoDB Connection Test")
    print("=" * 30)
    test_mongodb()