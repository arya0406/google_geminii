from pymongo import MongoClient
from dotenv import load_dotenv
import os
from event_planner_data import event_planners_data

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['venue_db']

# Create event planners collection
event_planners_collection = db['event_planners']

# Drop existing data
event_planners_collection.drop()

# Insert event planner data
event_planners_collection.insert_many(event_planners_data)

print("Event planner data added successfully!")