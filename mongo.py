from pymongo import MongoClient

client = MongoClient("mongodb+srv://admin:admin@cluster0.v6qlhmu.mongodb.net/?appName=Cluster0")
db = client["weddingDB"]

print("✅ MongoDB Connected Successfully")
# Create a collection (like a table)
messages = db["messages"]

# Insert a test message
sample_data = {
    "user": "Arya",
    "message": "Hello, MongoDB!",
    "sender": "user"
}

result = messages.insert_one(sample_data)
print("✅ Data Inserted with ID:", result.inserted_id)
# Fetch all data
print("\n📦 All messages in DB:")
for msg in messages.find():
    print(msg)