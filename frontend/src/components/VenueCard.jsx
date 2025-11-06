import React from 'react';
import { motion } from 'framer-motion';

function VenueCard({ venue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background border border-border rounded-lg shadow-md p-6 w-full hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
            {venue.name}
          </h3>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <span className="text-accent">📍</span> {venue.location}
          </p>
          {venue.requestedCapacity ? (
            <p className="text-primary mt-3 text-base flex items-center gap-2">
              <span className="text-accent">👥</span> 
              Matching Capacity: {venue.banquets?.filter(b => 
                b.capacity >= venue.requestedCapacity && 
                b.capacity <= venue.requestedCapacity + 100
              ).map(b => b.capacity).join(', ')} guests
            </p>
          ) : (
            <p className="text-primary mt-3 text-base flex items-center gap-2">
              <span className="text-accent">👥</span> 
              Total Capacity: {venue.total_capacity || venue.capacity || venue.banquets?.reduce((total, banquet) => total + banquet.capacity, 0)} guests
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-semibold text-primary mb-3 mt-6">
          {venue.requestedCapacity 
            ? `Banquet Halls Matching Your Capacity (${venue.requestedCapacity} guests):`
            : 'Available Banquet Halls:'}</h4>
        <div className="space-y-4">
          {venue.banquets?.filter(banquet => {
            const requestedCapacity = venue.requestedCapacity || 0;
            return requestedCapacity > 0 ? 
              (banquet.capacity >= requestedCapacity && banquet.capacity <= requestedCapacity + 100) : true;
          }).map((banquet, index) => (
            <motion.div 
              key={index} 
              className="bg-muted p-4 rounded-lg border border-border overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {banquet.image && (
                <div className="mb-4 rounded-lg overflow-hidden h-48 w-full bg-muted">
                  <img 
                    src={banquet.image} 
                    alt={banquet.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <p className="text-lg font-semibold text-foreground mb-3">{banquet.name}</p>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-accent">👥</span> 
                  <span className="text-base">{banquet.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-accent">💰</span>
                  <span className="text-base">₹{banquet.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-accent">⏱️</span>
                  <span className="text-base">{banquet.min_booking_hours}hrs min</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-semibold text-primary mb-3 mt-6">Facilities:</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🅿️", label: "Parking", value: venue.facilities?.parking },
            { icon: "🍽️", label: "Catering", value: venue.facilities?.catering },
            { icon: "🎨", label: "Décor", value: venue.facilities?.decor },
            { icon: "🛏️", label: "Rooms", value: venue.facilities?.rooms }
          ].map((facility, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-accent">{facility.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{facility.label}</p>
                <p className="text-base text-foreground">{facility.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-6">
        <h4 className="text-xl font-semibold text-primary mb-3">Amenities:</h4>
        <div className="flex flex-wrap gap-2">
          {venue.facilities?.amenities?.map((amenity, index) => (
            <motion.span 
              key={index} 
              className="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {amenity}
            </motion.span>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-6 border-t border-border pt-4">
        {venue.description}
      </p>
    </motion.div>
  );
}

export default VenueCard;
