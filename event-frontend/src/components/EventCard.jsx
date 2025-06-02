import React from 'react';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="card p-3 mb-3 shadow-sm h-100">
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold text-primary">{event.name}</h5>
        <span className="badge bg-primary ms-2">{event.category || 'General'}</span>
      </div>
      <div className="mb-1 text-secondary small">Lokasi: {event.location}</div>
      <div className="mb-1 text-secondary small">Peserta: {event.participants?.length || 0}</div>
      <div className="mb-2 text-info small fst-italic">{formatDate(event.date)}</div>
      <button className="btn btn-outline-primary w-100 mt-auto">Lihat Detail</button>
    </div>
  );
};

export default EventCard; 