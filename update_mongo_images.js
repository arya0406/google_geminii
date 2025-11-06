const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.v6qlhmu.mongodb.net/?appName=Cluster0";
console.log('🔗 Connecting to MongoDB...');

const client = new MongoClient(MONGO_URI);

const banquetImages = {
  "Grand Ballroom": "/images/banquets/taj-palace-banquet.jpg",
  "Royal Hall": "/images/banquets/royal-hall.jpg",
  "Maharaja Hall": "/images/banquets/maharaja-hall.jpg",
  "Crystal Palace": "/images/banquets/crystal-palace.jpg",
  "Elegant Banquet": "/images/banquets/elegant-banquet.jpg",
  "Heritage Hall": "/images/banquets/heritage-hall.jpg",
  "Golden Hall": "/images/banquets/golden-hall.jpg",
  "Sapphire Hall": "/images/banquets/sapphire-hall.jpg",
};

async function updateVenuesWithImages() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('venue_db');
    const venuesCollection = db.collection('venues');

    // Get all venues
    const venues = await venuesCollection.find({}).toArray();
    console.log(`📍 Found ${venues.length} venues to update`);

    let updatedCount = 0;

    for (const venue of venues) {
      let hasChanges = false;
      const updatedBanquets = venue.banquets?.map(banquet => {
        if (!banquet.image) {
          const banquetName = banquet.name || '';
          banquet.image = banquetImages[banquetName] || "/images/banquets/taj-palace-banquet.jpg";
          hasChanges = true;
          console.log(`  ➕ Added image to banquet: ${banquetName}`);
        }
        return banquet;
      });

      if (hasChanges) {
        await venuesCollection.updateOne(
          { _id: venue._id },
          { $set: { banquets: updatedBanquets } }
        );
        updatedCount++;
        console.log(`✅ Updated venue: ${venue.name}`);
      }
    }

    console.log(`\n✨ Successfully updated ${updatedCount} venues with banquet images!`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

updateVenuesWithImages();
