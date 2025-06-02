import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../services/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedEvents from '../components/FeaturedEvents';
import CTASection from '../components/CTASection';

const LandingPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
        setFilteredEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  const categories = ['all', 'workshop', 'conference', 'seminar', 'networking'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7BF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#262F67]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7BF]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4">
        <HeroSection />
        <FeaturedEvents />
        <CTASection />
      </main>
    </div>
  );
};

export default LandingPage; 