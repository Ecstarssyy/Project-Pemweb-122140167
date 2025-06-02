const API_URL = 'http://localhost:6543/api';

export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (data) => {
  const response = await fetch(`${API_URL}/events/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create event');
  return await response.json();
};

export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/edit/${id}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return await response.json();
};

export const updateEvent = async (id, data) => {
  const response = await fetch(`${API_URL}/events/edit/${id}` , {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update event');
  return await response.json();
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete event');
  return await response.json();
};

// PARTICIPANT API
export const getParticipantsByEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/participants/get/${eventId}`);
  if (!response.ok) throw new Error('Failed to fetch participants');
  return await response.json();
};

export const addParticipant = async (eventId, data) => {
  const response = await fetch(`${API_URL}/participants/create/${eventId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add participant');
  return await response.json();
};

export const deleteParticipant = async (participantId) => {
  const response = await fetch(`${API_URL}/participants/delete/${participantId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete participant');
  return await response.json();
}; 