import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import {
  fetchEvents, createEvent, updateEvent, deleteEvent, getEventById,
  getParticipantsByEvent, addParticipant, deleteParticipant
} from '../services/api';

const initialForm = { name: '', location: '' };
const initialParticipantForm = { name: '', email: '' };

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedId, setSelectedId] = useState(null);
  const [notif, setNotif] = useState(null);
  const modalRef = useRef();

  // Participant state
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [participantEvent, setParticipantEvent] = useState(null); // event object
  const [participants, setParticipants] = useState([]);
  const [participantForm, setParticipantForm] = useState(initialParticipantForm);
  const [participantLoading, setParticipantLoading] = useState(false);
  const [participantNotif, setParticipantNotif] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data event');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setForm(initialForm);
    setSelectedId(null);
    setShowModal(true);
  };

  const openEditModal = async (id) => {
    setModalType('edit');
    setSelectedId(id);
    try {
      const data = await getEventById(id);
      setForm({ name: data.name || '', location: data.location || '' });
      setShowModal(true);
    } catch (err) {
      setNotif({ type: 'danger', msg: 'Gagal mengambil data event.' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setSelectedId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await createEvent(form);
        setNotif({ type: 'success', msg: 'Event berhasil ditambahkan.' });
      } else {
        await updateEvent(selectedId, form);
        setNotif({ type: 'success', msg: 'Event berhasil diupdate.' });
      }
      handleCloseModal();
      loadEvents();
    } catch (err) {
      setNotif({ type: 'danger', msg: 'Gagal menyimpan event.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus event ini?')) return;
    try {
      await deleteEvent(id);
      setNotif({ type: 'success', msg: 'Event berhasil dihapus.' });
      loadEvents();
    } catch (err) {
      setNotif({ type: 'danger', msg: 'Gagal menghapus event.' });
    }
  };

  // PARTICIPANT HANDLERS
  const openParticipantModal = async (event) => {
    setParticipantEvent(event);
    setShowParticipantModal(true);
    setParticipantForm(initialParticipantForm);
    setParticipantNotif(null);
    setParticipantLoading(true);
    try {
      const data = await getParticipantsByEvent(event.id);
      setParticipants(data);
      setParticipantLoading(false);
    } catch (err) {
      setParticipantNotif({ type: 'danger', msg: 'Gagal memuat participant.' });
      setParticipantLoading(false);
    }
  };

  const handleCloseParticipantModal = () => {
    setShowParticipantModal(false);
    setParticipantEvent(null);
    setParticipants([]);
    setParticipantForm(initialParticipantForm);
    setParticipantNotif(null);
  };

  const handleParticipantChange = (e) => {
    setParticipantForm({ ...participantForm, [e.target.name]: e.target.value });
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!participantForm.name) return;
    setParticipantNotif(null);
    try {
      await addParticipant(participantEvent.id, participantForm);
      setParticipantNotif({ type: 'success', msg: 'Participant berhasil ditambahkan.' });
      setParticipantForm(initialParticipantForm);
      // reload participants
      const data = await getParticipantsByEvent(participantEvent.id);
      setParticipants(data);
    } catch (err) {
      setParticipantNotif({ type: 'danger', msg: 'Gagal menambah participant.' });
    }
  };

  const handleDeleteParticipant = async (pid) => {
    if (!window.confirm('Yakin ingin menghapus participant ini?')) return;
    try {
      await deleteParticipant(pid);
      setParticipantNotif({ type: 'success', msg: 'Participant berhasil dihapus.' });
      // reload participants
      const data = await getParticipantsByEvent(participantEvent.id);
      setParticipants(data);
    } catch (err) {
      setParticipantNotif({ type: 'danger', msg: 'Gagal menghapus participant.' });
    }
  };

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [showModal]);

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h1 className="h2 fw-bold mb-3 text-primary">Welcome, Admin!</h1>
        <p className="mb-4 text-secondary">Manage your events below. You can add, edit, or delete events as needed.</p>
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-success px-4" onClick={openAddModal}>
            <i className="bi bi-plus-lg me-2"></i>Add Event
          </button>
        </div>
        {notif && (
          <div className={`alert alert-${notif.type} alert-dismissible fade show`} role="alert">
            {notif.msg}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotif(null)}></button>
          </div>
        )}
        <div className="card shadow-sm border-0">
          {loading ? (
            <div className="text-center py-5">Loading events...</div>
          ) : error ? (
            <div className="alert alert-danger m-3">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '3%'}}>#</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Participants</th>
                    <th style={{width: '20%'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No events found.</td></tr>
                  ) : events.map((event, idx) => (
                    <tr key={event.id} style={{cursor: 'pointer'}}>
                      <td>{idx + 1}</td>
                      <td className="fw-semibold text-primary">{event.name}</td>
                      <td>{event.location}</td>
                      <td>{event.date ? new Date(event.date).toLocaleDateString('id-ID') : '-'}</td>
                      <td>
                        <span className="badge bg-info text-dark">{event.participants?.length || 0}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            title="Participants" 
                            onClick={() => openParticipantModal(event)}
                          >
                            <i className="bi bi-people me-1"></i>
                            <span className="d-none d-sm-inline">Participants</span>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning" 
                            title="Edit" 
                            onClick={() => openEditModal(event.id)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            title="Delete" 
                            onClick={() => handleDelete(event.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Tambah/Edit Event */}
        {showModal && (
          <div className="modal fade show" tabIndex="-1" style={{display: 'block', background: 'rgba(0,0,0,0.3)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalType === 'add' ? 'Add Event' : 'Edit Event'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input ref={modalRef} type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required autoFocus />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{modalType === 'add' ? 'Add' : 'Save'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Modal backdrop */}
        {showModal && <div className="modal-backdrop fade show"></div>}

        {/* Modal Participant */}
        {showParticipantModal && (
          <div className="modal fade show" tabIndex="-1" style={{display: 'block', background: 'rgba(0,0,0,0.3)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-light border-bottom-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-people-fill text-primary me-2"></i>
                    Participants for: <span className="text-primary fw-bold">{participantEvent?.name}</span>
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseParticipantModal}></button>
                </div>
                <div className="modal-body">
                  {participantNotif && (
                    <div className={`alert alert-${participantNotif.type} alert-dismissible fade show d-flex align-items-center`} role="alert">
                      <i className={`bi ${participantNotif.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-2 fs-5`}></i>
                      <div>{participantNotif.msg}</div>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setParticipantNotif(null)}></button>
                    </div>
                  )}
                  <form className="row g-3 mb-4 align-items-center" onSubmit={handleAddParticipant}>
                    <div className="col-md-5">
                      <input 
                        type="text" 
                        className="form-control rounded-pill shadow-sm" 
                        name="name" 
                        value={participantForm.name} 
                        onChange={handleParticipantChange} 
                        placeholder="Name" 
                        required 
                      />
                    </div>
                    <div className="col-md-5">
                      <input 
                        type="email" 
                        className="form-control rounded-pill shadow-sm" 
                        name="email" 
                        value={participantForm.email} 
                        onChange={handleParticipantChange} 
                        placeholder="Email (optional)" 
                      />
                    </div>
                    <div className="col-md-2 d-grid">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm">
                        <i className="bi bi-plus-lg me-1"></i>Add
                      </button>
                    </div>
                  </form>
                  {participantLoading ? (
                    <div className="text-center py-4">Loading participants...</div>
                  ) : participants.length === 0 ? (
                    <div className="text-center py-4 text-secondary">No participants found.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped align-middle">
                        <thead className="table-light">
                          <tr>
                            <th style={{width: '5%'}} className="fs-6">#</th>
                            <th className="fs-6">Name</th>
                            <th className="fs-6">Email</th>
                            <th style={{width: '10%'}} className="fs-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p, idx) => (
                            <tr key={p.id}>
                              <td>{idx + 1}</td>
                              <td className="fw-semibold">
                                <span className="me-2 bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '2rem', height: '2rem', fontWeight: 'bold'}}>
                                  {p.name?.[0]?.toUpperCase() || '?'}
                                </span>
                                {p.name}
                              </td>
                              <td>{p.email}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger rounded-circle fs-5 d-flex align-items-center justify-content-center mx-auto" 
                                  title="Delete" 
                                  style={{width: '2.2rem', height: '2.2rem'}} 
                                  onClick={() => handleDeleteParticipant(p.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-secondary btn-lg rounded-pill px-5" onClick={handleCloseParticipantModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showParticipantModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </div>
  );
};

export default AdminPage;
