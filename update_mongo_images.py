    import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database Connection
MONGO_URI = os.getenv('MONGO_URI')
client = pymongo.MongoClient(MONGO_URI)
db = client['venue_db']
venues_collection = db['venues']

# Sample banquet images mapping
banquet_images = {
    "Grand Ballroom": "/images/banquets/taj-palace-banquet.jpg",
    "Royal Hall": "/images/banquets/royal-hall.jpg",
    "Maharaja Hall": "/images/banquets/maharaja-hall.jpg",
    "Crystal Palace": "/images/banquets/crystal-palace.jpg",
    "Elegant Banquet": "/images/banquets/elegant-banquet.jpg",
    "Heritage Hall": "/images/banquets/heritage-hall.jpg",
    "Golden Hall": "/images/banquets/golden-hall.jpg",
    "Sapphire Hall": "/images/banquets/sapphire-hall.jpg",
}

def add_images_to_banquets():
    """Add image field to all banquet halls in MongoDB"""
    try:
        # Get all venues
        venues = venues_collection.find()
        
        updated_count = 0
        for venue in venues:
            venue_id = venue['_id']
            banquets = venue.get('banquets', [])
            
            updated_banquets = False
            
            # Add images to each banquet hall
            for banquet in banquets:
                banquet_name = banquet.get('name', '')
                
                # Check if image already exists
                if 'image' not in banquet:
                    # Try to find matching image
                    if banquet_name in banquet_images:
                        banquet['image'] = banquet_images[banquet_name]
                    else:
                        # Use default image
                        banquet['image'] = "/images/banquets/taj-palace-banquet.jpg"
                    
                    updated_banquets = True
            
            # Update the venue if any banquets were modified
            if updated_banquets:
                venues_collection.update_one(
                    {'_id': venue_id},
                    {'$set': {'banquets': banquets}}
                )
                updated_count += 1
                print(f"✅ Updated venue: {venue.get('name')} with {len(banquets)} banquet images")
        
        print(f"\n✨ Successfully updated {updated_count} venues with banquet images!")
        
    except Exception as e:
        print(f"❌ Error updating MongoDB: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    print("🔄 Starting to add images to MongoDB venues...")
    add_images_to_banquets()
