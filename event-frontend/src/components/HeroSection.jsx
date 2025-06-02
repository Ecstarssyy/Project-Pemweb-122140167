import React from 'react';

const HeroSection = () => (
  <section className="container my-5">
    <div className="position-relative rounded-4 overflow-hidden" style={{height: '350px'}}>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
        alt="Event Hero"
        className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
        style={{objectFit: 'cover'}}
      />
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center" style={{background: 'rgba(0,0,0,0.5)'}}>
        <h1 className="display-4 fw-bold text-white mb-3">Crafting Unforgettable Moments</h1>
        <p className="lead text-white mb-4">We specialize in creating bespoke events that reflect your unique style and vision. From intimate gatherings to grand celebrations, our team ensures every detail is perfect.</p>
        <button className="btn btn-primary btn-lg">Explore Our Services</button>
      </div>
    </div>
  </section>
);

export default HeroSection; 