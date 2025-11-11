import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowLeft, FileText, Image, Star } from 'lucide-react';

function VenueDetails() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  // Mock venue data - in a real app, this would come from an API or props
  const mockVenues = [
    {
      id: 'royal-palace',
      name: 'Royal Palace Wedding Complex',
      location: 'Delhi',
      policies: [
        {
          title: 'Booking & Cancellation Policy',
          content: 'Bookings require 50% advance payment. Cancellation up to 30 days before event: 25% deduction. 15-30 days: 50% deduction. Less than 15 days: 100% deduction.'
        },
        {
          title: 'Timing & Duration Policy',
          content: 'Minimum booking duration is 4 hours. Events can run from 8 AM to 12 AM. Additional hours charged at 15% of base rate per hour.'
        },
        {
          title: 'Food & Beverage Policy',
          content: 'In-house catering available. Outside caterers allowed with prior approval. Alcohol service requires special permission and additional charges.'
        },
        {
          title: 'Decor & Setup Policy',
          content: 'In-house decor team available. Outside decorators allowed with venue approval. Setup time included in booking. Cleanup charges may apply.'
        }
      ],
      images: [
        { url: '/images/venues/royal-palace/main-hall.jpg', alt: 'Main Crystal Ballroom', caption: 'Grand Crystal Ballroom - Capacity 800 guests' },
        { url: '/images/venues/royal-palace/garden.jpg', alt: 'Garden Court', caption: 'Garden Court - Perfect for outdoor ceremonies' },
        { url: '/images/venues/royal-palace/bridal-room.jpg', alt: 'Bridal Room', caption: 'Luxury Bridal Preparation Room' },
        { url: '/images/venues/royal-palace/dining.jpg', alt: 'Dining Area', caption: 'Elegant Dining Setup' },
        { url: '/images/venues/royal-palace/entrance.jpg', alt: 'Entrance', caption: 'Grand Entrance with Royal Architecture' },
        { url: '/images/venues/royal-palace/reception.jpg', alt: 'Reception Area', caption: 'Reception Area with Crystal Chandelier' }
      ],
      rating: 4.8,
      hotelStars: 5,
      pricing: { vegPrice: 1200, nonVegPrice: 1500 }
    },
    {
      id: 'grand-celebrations',
      name: 'The Grand Celebrations',
      location: 'Mumbai',
      policies: [
        {
          title: 'Advance Payment Policy',
          content: '75% advance payment required at booking. Balance payment due 7 days before event. All payments non-refundable within 48 hours of event.'
        },
        {
          title: 'Guest Capacity Policy',
          content: 'Maximum capacity strictly enforced. Additional guests charged at premium rate. Underage guests counted in total capacity.'
        },
        {
          title: 'Music & Entertainment Policy',
          content: 'Professional DJ and sound system included. Live bands require approval. Volume restrictions apply after 10 PM in residential areas.'
        },
        {
          title: 'Parking & Security Policy',
          content: 'Valet parking available. Security personnel provided. Guest vehicles parked at owner\'s risk. No overnight parking allowed.'
        }
      ],
      images: [
        { url: '/images/venues/grand-celebrations/sea-view.jpg', alt: 'Sea View Ballroom', caption: 'Sea View Ballroom with Ocean Views' },
        { url: '/images/venues/grand-celebrations/terrace.jpg', alt: 'Terrace', caption: 'Rooftop Terrace for Cocktail Parties' },
        { url: '/images/venues/grand-celebrations/lobby.jpg', alt: 'Grand Lobby', caption: 'Elegant Lobby with Modern Design' },
        { url: '/images/venues/grand-celebrations/dining-hall.jpg', alt: 'Dining Hall', caption: 'Spacious Dining Hall' },
        { url: '/images/venues/grand-celebrations/pool.jpg', alt: 'Pool Area', caption: 'Infinity Pool with City Views' },
        { url: '/images/venues/grand-celebrations/bar.jpg', alt: 'Bar Area', caption: 'Signature Cocktail Bar' }
      ],
      rating: 4.6,
      hotelStars: 4,
      pricing: { vegPrice: 1500, nonVegPrice: 1800 }
    }
  ];

  const venue = mockVenues.find(v => v.id === venueId);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Venue Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              {venue.name}
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <span>📍</span> {venue.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= venue.hotelStars
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-muted'
                }`}
              />
            ))}
            <span className="text-sm font-semibold text-foreground ml-1">
              {venue.hotelStars}-Star Hotel
            </span>
          </div>
        </div>

        {/* Policies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background border border-border rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">Venue Policies & Terms</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {venue.policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-lg p-4 border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary">📋</span>
                  {policy.title}
                </h3>
                <p className="text-sm text-black leading-relaxed">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background border border-border rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Image className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-semibold text-primary">Venue Gallery</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {venue.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-muted/20"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-4xl">🏢</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <p className="text-sm font-medium">{image.caption}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-black text-center">
                    {image.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default VenueDetails;