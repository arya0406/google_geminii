from pymongo import MongoClient
from dotenv import load_dotenv
import os
from event_planner_data import event_planners_data

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    print("❌ MONGO_URI not found in .env file")
    exit(1)

try:
    client = MongoClient(MONGO_URI)
    db = client['venue_db']
    event_planners_collection = db['event_planners']

    # Check if data already exists
    count = event_planners_collection.count_documents({})
    print(f"📊 Found {count} event planners in database")

    if count == 0:
        print("📥 Importing event planner data...")
        # Drop existing data (if any)
        event_planners_collection.drop()

        # Insert event planner data
        result = event_planners_collection.insert_many(event_planners_data)
        print(f"✅ Successfully imported {len(result.inserted_ids)} event planners")
    else:
        print("✅ Event planner data already exists")

    # Show sample data
    sample = event_planners_collection.find_one()
    if sample:
        print("\n📋 Sample event planner data:")
        print(f"Name: {sample.get('name')}")
        print(f"City: {sample.get('city')}")
        print(f"Rating: {sample.get('rating')}")
        print(f"Experience: {sample.get('experience_years')} years")

    print("\n🎉 Database check completed!")

except Exception as e:
    print(f"❌ Error: {str(e)}")