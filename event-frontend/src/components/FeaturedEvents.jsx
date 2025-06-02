import React from 'react';

const events = [
  {
    title: 'Corporate Conference',
    desc: 'A successful conference with engaging speakers and networking opportunities.',
    img: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde16?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Outdoor Wedding',
    desc: 'A beautiful outdoor wedding with stunning floral arrangements and a romantic atmosphere.',
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Birthday Party',
    desc: 'A fun-filled birthday party with games, music, and delicious food.',
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Product Launch',
    desc: 'An innovative product launch with interactive displays and coverage.',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
  },
];

const FeaturedEvents = () => (
  <section className="container my-5">
    <h2 className="h3 fw-bold mb-4 text-primary">Featured Events</h2>
    <div className="row g-4">
      {events.map((event, idx) => (
        <div className="col-12 col-sm-6 col-md-3" key={idx}>
          <div className="card h-100 shadow-sm">
            <img src={event.img} className="card-img-top" alt={event.title} style={{height: '130px', objectFit: 'cover'}} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{event.title}</h5>
              <p className="card-text text-secondary">{event.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedEvents; 