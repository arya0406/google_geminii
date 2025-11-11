import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Star, Plus, Minus } from 'lucide-react';

function EventPlannerCard({ eventPlanner }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  // Auto-open first section on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowServices(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!eventPlanner) return null;

  // Generate event planner ID from name
  const plannerId = eventPlanner.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-background border border-border rounded-lg shadow-md p-6 w-full hover:shadow-lg"
    >
      {/* Header: Event Planner Name + View More Button */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-2xl font-serif font-bold text-primary">
          {eventPlanner.name}
        </h3>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="hover:bg-muted px-3"
        >
          <span className="text-base font-medium text-[hsl(320,30%,40%)]">View More</span>
        </Button>
      </div>

      {/* Location */}
      <p className="text-foreground text-sm mb-3 flex items-center gap-2">
        <span className="text-accent">📍</span> {eventPlanner.location}
      </p>

      {/* Pricing: Total Experience, Per Event Cost */}
      <div className="flex items-center gap-8 mb-3">
        {eventPlanner.pricing?.total_experience && (
          <div className="flex items-center gap-2">
            <span className="text-accent text-sm">⭐</span>
            <span className="text-sm font-medium text-foreground">Total Experience:</span>
            <span className="text-sm font-bold text-primary">{eventPlanner.pricing.total_experience}</span>
          </div>
        )}
        {eventPlanner.rental?.amount && (
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">💰</span>
            <span className="text-sm font-medium text-foreground">Per Event:</span>
            <span className="text-sm font-bold text-primary">₹{eventPlanner.rental.amount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

        {/* Events Planned Box + Rating Box */}
        <div className="flex gap-3 mb-4">
          {/* Events Planned Box */}
          <div className="flex-1 bg-muted rounded-lg p-3 border border-border">
            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
              <span className="text-base">📊</span>
              Events Planned
            </h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-secondary text-xs">🎯</span>
                <span className="text-xs text-foreground">Total Events: <span className="font-medium text-foreground">{eventPlanner.total_events_planned}</span></span>
              </div>
            </div>
          </div>        {/* Rating Box */}
        <div className="flex-1 bg-muted rounded-lg p-3 border border-border">
          <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
            <Star className="h-4 w-4 text-accent" />
            Rating
          </h4>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= (eventPlanner.rating || 4)
                    ? 'text-accent fill-accent'
                    : 'text-muted'
                }`}
              />
            ))}
            <span className="text-xs text-foreground ml-1">
              {eventPlanner.rating || 4.0}/5.0
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {/* Services Section */}
              <div className="bg-muted rounded-lg p-3 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                    <span className="text-lg">🛠️</span>
                    Services & Amenities
                  </h4>
                  <Button
                    onClick={() => setShowServices(!showServices)}
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted/80 h-6 px-2"
                  >
                    {showServices ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <AnimatePresence>
                  {showServices && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2">
                        {/* Services */}
                        {eventPlanner.services && eventPlanner.services.amenities && eventPlanner.services.amenities.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Services:</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                              {eventPlanner.services.amenities.map((service, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="bg-secondary/10 backdrop-blur-sm rounded-md p-1 border border-secondary/20 text-center"
                                >
                                  <span className="text-foreground font-medium text-xs">{service}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Event Types */}
                        {eventPlanner.event_types && eventPlanner.event_types.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-foreground mb-1">Event Types:</h5>
                            <div className="flex flex-wrap gap-1">
                              {eventPlanner.event_types.map((eventType, index) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.03 }}
                                  className="bg-accent/10 text-foreground px-2 py-1 rounded-full text-xs font-medium border border-accent/20"
                                >
                                  {eventType}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About the Event Planner Section */}
              <div className="bg-muted rounded-lg p-3 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    About the Event Planner
                  </h4>
                  <Button
                    onClick={() => setShowAbout(!showAbout)}
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted/80 h-6 px-2"
                  >
                    {showAbout ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <AnimatePresence>
                  {showAbout && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-secondary/10 backdrop-blur-sm rounded-md p-3 border border-secondary/20">
                        <p className="text-sm text-black leading-relaxed">
                          {eventPlanner.description || "Professional event planning company with extensive experience in organizing memorable events and celebrations."}
                        </p>
                        {eventPlanner.services && (
                          <div className="mt-3">
                            <h6 className="text-xs font-semibold text-foreground mb-1">Key Services:</h6>
                            <ul className="text-xs text-black space-y-1">
                              {eventPlanner.services.decor && <li>• {eventPlanner.services.decor}</li>}
                              {eventPlanner.services.catering && <li>• {eventPlanner.services.catering}</li>}
                              {eventPlanner.services.entertainment && <li>• {eventPlanner.services.entertainment}</li>}
                              {eventPlanner.services.photography && <li>• {eventPlanner.services.photography}</li>}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Details Section */}
              <div className="bg-muted rounded-lg p-3 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    Contact Details
                  </h4>
                  <Button
                    onClick={() => setShowContact(!showContact)}
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted/80 h-6 px-2"
                  >
                    {showContact ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <AnimatePresence>
                  {showContact && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-accent/10 backdrop-blur-sm rounded-md p-3 border border-accent/20 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-accent">📍</span>
                          <span className="text-sm text-black">{eventPlanner.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-accent">📞</span>
                          <span className="text-sm text-black">+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-accent">✉️</span>
                          <span className="text-sm text-black">info@{eventPlanner.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-accent">🌐</span>
                          <span className="text-sm text-black underline">www.{eventPlanner.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Portfolio Section */}
              <div className="bg-muted rounded-lg p-3 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-semibold text-primary flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    Portfolio & Reviews
                  </h4>
                  <Button
                    onClick={() => setShowPortfolio(!showPortfolio)}
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-muted/80 h-6 px-2"
                  >
                    {showPortfolio ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                <AnimatePresence>
                  {showPortfolio && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-secondary/10 backdrop-blur-sm rounded-md p-3 border border-secondary/20">
                        <p className="text-sm text-black mb-3">
                          View our complete portfolio of successful events and client reviews.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => {
                              window.open(`/event-planner/${plannerId}`, '_blank');
                            }}
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            📋 Portfolio
                          </Button>
                          <Button
                            onClick={() => {
                              window.open(`/event-planner/${plannerId}`, '_blank');
                            }}
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-secondary hover:text-secondary-foreground transition-colors"
                          >
                            ⭐ Reviews
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EventPlannerCard;
