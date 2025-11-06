// MongoDB Update Script
// Copy and paste this into MongoDB Atlas Web Shell or MongoDB Compass

// Update all venues to add images to banquets

db.venues.updateMany(
  {
    "banquets.image": { $exists: false }
  },
  [
    {
      $set: {
        banquets: {
          $map: {
            input: "$banquets",
            as: "banquet",
            in: {
              $cond: [
                { $ne: ["$$banquet.image", null] },
                "$$banquet",
                {
                  $mergeObjects: [
                    "$$banquet",
                    {
                      image: {
                        $switch: {
                          branches: [
                            { case: { $eq: ["$$banquet.name", "Grand Ballroom"] }, then: "/images/banquets/taj-palace-banquet.jpg" },
                            { case: { $eq: ["$$banquet.name", "Royal Hall"] }, then: "/images/banquets/royal-hall.jpg" },
                            { case: { $eq: ["$$banquet.name", "Maharaja Hall"] }, then: "/images/banquets/maharaja-hall.jpg" },
                            { case: { $eq: ["$$banquet.name", "Crystal Palace"] }, then: "/images/banquets/crystal-palace.jpg" },
                            { case: { $eq: ["$$banquet.name", "Elegant Banquet"] }, then: "/images/banquets/elegant-banquet.jpg" },
                            { case: { $eq: ["$$banquet.name", "Heritage Hall"] }, then: "/images/banquets/heritage-hall.jpg" },
                            { case: { $eq: ["$$banquet.name", "Golden Hall"] }, then: "/images/banquets/golden-hall.jpg" },
                            { case: { $eq: ["$$banquet.name", "Sapphire Hall"] }, then: "/images/banquets/sapphire-hall.jpg" }
                          ],
                          default: "/images/banquets/taj-palace-banquet.jpg"
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]
);

// Verify the update
db.venues.find({}, { name: 1, "banquets.name": 1, "banquets.image": 1 }).pretty();
