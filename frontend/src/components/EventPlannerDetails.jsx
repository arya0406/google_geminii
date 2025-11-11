import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowLeft, FileText, Image, Star, Users, Calendar, Award } from 'lucide-react';

function EventPlannerDetails() {
  const { plannerId } = useParams();
  const navigate = useNavigate();

  // Mock event planner data - in a real app, this would come from an API or props
  const mockEventPlanners = [
    {
      id: 'elite-events',
      name: 'Elite Events Management',
      location: 'Delhi',
      total_events_planned: 500,
      event_types: [
        'Wedding',
        'Corporate Events',
        'Birthday Parties',
        'Anniversaries',
        'Engagement Ceremonies'
      ],
      pricing: {
        event_planned: 150000,
        total_experience: '8+ Years',
        startingPrice: 150000
      },
      services: {
        decor: 'Complete decor setup and management',
        catering: 'Catering coordination and management',
        entertainment: 'DJ, music, and entertainment booking',
        photography: 'Photography and videography coordination',
        transportation: 'Guest transportation arrangements',
        amenities: [
          'Event Planning',
          'Vendor Management',
          'Timeline Creation',
          'Budget Management',
          'Guest Coordination',
          'Day-of Coordination'
        ]
      },
      description: 'Premier event planning company specializing in weddings and corporate events with over 8 years of experience.',
      hotelStars: 5,
      rating: 4.9,
      portfolio: [
        { type: 'Wedding', count: 200, image: '/images/planners/elite/wedding1.jpg' },
        { type: 'Corporate', count: 150, image: '/images/planners/elite/corporate1.jpg' },
        { type: 'Birthday', count: 100, image: '/images/planners/elite/birthday1.jpg' },
        { type: 'Anniversary', count: 50, image: '/images/planners/elite/anniversary1.jpg' }
      ],
      reviews: [
        { name: 'Priya Sharma', rating: 5, comment: 'Absolutely amazing service! They made our wedding day perfect.' },
        { name: 'Rajesh Kumar', rating: 5, comment: 'Professional team with great attention to detail.' },
        { name: 'Meera Patel', rating: 4, comment: 'Good coordination and beautiful decor arrangements.' }
      ]
    },
    {
      id: 'dream-day-planners',
      name: 'Dream Day Planners',
      location: 'Mumbai',
      total_events_planned: 350,
      event_types: [
        'Destination Weddings',
        'Beach Weddings',
        'Garden Weddings',
        'Traditional Ceremonies',
        'Reception Parties'
      ],
      pricing: {
        event_planned: 200000,
        total_experience: '6+ Years',
        startingPrice: 200000
      },
      services: {
        decor: 'Themed decor and floral arrangements',
        catering: 'Multi-cuisine catering options',
        entertainment: 'Live music and cultural performances',
        photography: 'Pre-wedding shoots and event coverage',
        transportation: 'Luxury transportation for bridal party',
        amenities: [
          'Destination Planning',
          'Cultural Ceremonies',
          'Mehendi & Sangeet Planning',
          'Bridal Styling',
          'Guest Management',
          'Post-event Support'
        ]
      },
      description: 'Specialized in destination and cultural weddings with personalized planning services.',
      hotelStars: 4,
      rating: 4.7,
      portfolio: [
        { type: 'Destination Wedding', count: 120, image: '/images/planners/dream/destination1.jpg' },
        { type: 'Beach Wedding', count: 80, image: '/images/planners/dream/beach1.jpg' },
        { type: 'Garden Wedding', count: 100, image: '/images/planners/dream/garden1.jpg' },
        { type: 'Traditional Ceremony', count: 50, image: '/images/planners/dream/traditional1.jpg' }
      ],
      reviews: [
        { name: 'Amit Singh', rating: 5, comment: 'Dream Day made our destination wedding unforgettable!' },
        { name: 'Kavita Joshi', rating: 5, comment: 'Excellent coordination for our beach wedding.' },
        { name: 'Vikram Rao', rating: 4, comment: 'Good service with creative planning ideas.' }
      ]
    }
  ];

  const planner = mockEventPlanners.find(p => p.id === plannerId);

  if (!planner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Planner Not Found</h1>
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
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              {planner.name}
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <span>📍</span> {planner.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= planner.hotelStars
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-muted'
                }`}
              />
            ))}
            <span className="text-sm font-semibold text-foreground ml-1">
              {planner.hotelStars}-Star Service
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border border-border rounded-lg p-6 text-center"
          >
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{planner.total_events_planned}</div>
            <div className="text-sm text-muted-foreground">Events Planned</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background border border-border rounded-lg p-6 text-center"
          >
            <Calendar className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{planner.pricing.total_experience}</div>
            <div className="text-sm text-muted-foreground">Experience</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background border border-border rounded-lg p-6 text-center"
          >
            <Award className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{planner.rating}/5.0</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background border border-border rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary">Services & Expertise</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Event Types</h3>
              <div className="flex flex-wrap gap-2">
                {planner.event_types.map((eventType, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                  >
                    {eventType}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Services Offered</h3>
              <div className="grid gap-2">
                {planner.services.amenities.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-primary">✓</span>
                    <span className="text-black text-sm">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">About Our Services</h3>
            <p className="text-black leading-relaxed">{planner.description}</p>
          </div>
        </motion.div>

        {/* Portfolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background border border-border rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Image className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-semibold text-primary">Portfolio & Achievements</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {planner.portfolio.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-muted/20 p-4 text-center"
              >
                <div className="aspect-square bg-muted flex items-center justify-center mb-3">
                  <span className="text-3xl">📸</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.type}</h4>
                <p className="text-sm text-black">{item.count} Events</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-background border border-border rounded-lg shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Star className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold text-primary">Client Reviews</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {planner.reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-lg p-4 border border-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{review.name}</span>
                </div>
                <p className="text-black text-sm leading-relaxed">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EventPlannerDetails;