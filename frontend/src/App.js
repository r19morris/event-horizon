import React, { useState } from 'react';
import './App.css';
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  User,
  Clock,
  UtensilsCrossed,
  BedDouble,
  Ticket
} from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    people: '1',
    constraints: '',
  });

  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | flights | hotels | events | food

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { origin, destination, startDate, endDate, people } = formData;

    if (!origin || !destination || !startDate || !endDate || !people) {
      setError('Please fill out all required fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      setError('Please choose a valid date range.');
      return;
    }

    const generated = buildItinerary(formData);
    setItinerary(generated);
    setActiveTab('overview');
  };

  const handleReset = () => {
    setItinerary(null);
    setError('');
    setActiveTab('overview');
  };

  const tabClass = (id) =>
    `tab-button ${activeTab === id ? 'tab-button-active' : ''}`;

  const tabLabel = (id) => {
    switch (id) {
      case 'overview':
        return 'Overview';
      case 'flights':
        return 'Flights';
      case 'hotels':
        return 'Hotel reservations';
      case 'events':
        return 'Events & activities';
      case 'food':
        return 'Food & restaurants';
      default:
        return '';
    }
  };

  return (
    <div className="app">
      {/* HEADER + FAKE ACCOUNT / HISTORY BANNER */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-badge">
            <Plane size={22} />
          </div>
          <div>
            <h1>Event Horizon</h1>
            <p>the intelligent architect of your travel</p>
          </div>
        </div>

        <div className="header-right">
          <div className="trip-history">
            <span className="chip chip-muted">Last trip: New York → London</span>
            <span className="chip chip-muted">Total trips planned: 7</span>
          </div>
          <div className="profile-pill">
            <div className="avatar">
              <User size={16} />
            </div>
            <div className="profile-text">
              <span className="profile-name">Hackathon Demo</span>
              <span className="profile-sub">Prototype account · Trip history</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* LEFT: INPUT FORM */}
        <section className="card card-form">
          <div className="card-title-with-icon">
            <div className="icon-circle">
              <MapPin size={18} />
            </div>
            <div>
              <h2>Trip Setup</h2>
              <p className="subtitle">
                Answer 4 key questions and optionally add constraints. In the full product, Claude would use this
                to deep-fill reservations and logistics.
              </p>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <label>
              <span className="label-title">
                <MapPin size={14} className="label-icon" />
                Starting point<span className="required">*</span>
              </span>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g., New York City"
              />
            </label>

            <label>
              <span className="label-title">
                <MapPin size={14} className="label-icon" />
                Destination<span className="required">*</span>
              </span>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Tokyo"
              />
            </label>

            <div className="form-row">
              <label>
                <span className="label-title">
                  <Calendar size={14} className="label-icon" />
                  Start date<span className="required">*</span>
                </span>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span className="label-title">
                  <Calendar size={14} className="label-icon" />
                  End date<span className="required">*</span>
                </span>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              <span className="label-title">
                <Users size={14} className="label-icon" />
                Number of travelers<span className="required">*</span>
              </span>
              <select
                name="people"
                value={formData.people}
                onChange={handleChange}
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3 people</option>
                <option value="4">4 people</option>
                <option value="5">5+ people</option>
              </select>
            </label>

            <label>
              <span className="label-title">
                <Clock size={14} className="label-icon" />
                Constraints & preferences (optional)
              </span>
              <textarea
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                placeholder="Budget, hotel type, activities you like/dislike, mobility constraints, dietary needs, etc."
                rows={4}
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="btn primary">
                Generate itinerary
              </button>
              {itinerary && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleReset}
                >
                  Start over
                </button>
              )}
            </div>
          </form>
        </section>

        {/* RIGHT: ITINERARY OUTPUT + TABS */}
        <section className="card card-output">
          <div className="card-title-with-icon">
            <div className="icon-circle icon-circle-secondary">
              <Clock size={18} />
            </div>
            <div>
              <h2>Itinerary</h2>
              <p className="subtitle">
                High-level plan plus future detail views for flights, hotels, events, and food.
              </p>
            </div>
          </div>

          {/* Decorative tabs (non-functional backend, but clickable in UI) */}
          <div className="tab-row">
            <button
              type="button"
              className={tabClass('overview')}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">
                <MapPin size={14} />
              </span>
              Overview
            </button>
            <button
              type="button"
              className={tabClass('flights')}
              onClick={() => setActiveTab('flights')}
            >
              <span className="tab-icon">
                <Plane size={14} />
              </span>
              Flights
            </button>
            <button
              type="button"
              className={tabClass('hotels')}
              onClick={() => setActiveTab('hotels')}
            >
              <span className="tab-icon">
                <BedDouble size={14} />
              </span>
              Hotels
            </button>
            <button
              type="button"
              className={tabClass('events')}
              onClick={() => setActiveTab('events')}
            >
              <span className="tab-icon">
                <Ticket size={14} />
              </span>
              Events
            </button>
            <button
              type="button"
              className={tabClass('food')}
              onClick={() => setActiveTab('food')}
            >
              <span className="tab-icon">
                <UtensilsCrossed size={14} />
              </span>
              Food
            </button>
          </div>

          {!itinerary && (
            <div className="placeholder">
              <p>
                Fill in the trip details on the left and click <strong>Generate itinerary</strong>.
              </p>
              <ul>
                <li>See a day-by-day plan</li>
                <li>Logistics summary (travel &amp; lodging)</li>
                <li>Future tabs for deep booking details via Claude</li>
              </ul>
            </div>
          )}

          {itinerary && activeTab === 'overview' && (
            <>
              {/* Summary */}
              <div className="summary">
                <h3>Trip overview</h3>
                <p>
                  <strong>{itinerary.origin}</strong> → <strong>{itinerary.destination}</strong>
                </p>
                <p>
                  {itinerary.startDate} – {itinerary.endDate} • {itinerary.peopleLabel}
                </p>
                {itinerary.constraints && (
                  <p className="constraints">
                    <span>Constraints & preferences: </span>
                    {itinerary.constraints}
                  </p>
                )}
              </div>

              {/* Logistics */}
              <div className="logistics">
                <h3>Logistics (mocked suggestions)</h3>
                <ul>
                  <li>
                    ✈️ <strong>Flights:</strong> Aim for arrival in {itinerary.destination} by the afternoon of{' '}
                    {itinerary.startDate}. In production, Claude would choose and book specific options.
                  </li>
                  <li>
                    🏨 <strong>Accommodation:</strong> Stay near the central area of {itinerary.destination} to
                    minimize local travel time.
                  </li>
                  <li>
                    🚍 <strong>Local transport:</strong> Mix of public transit and short rideshares. Walk when
                    possible to explore.
                  </li>
                </ul>
              </div>

              {/* Daily plan */}
              <div className="days">
                <h3>Day-by-day plan</h3>
                {itinerary.days.map((day) => (
                  <div key={day.date} className="day-card">
                    <div className="day-header">
                      <span className="day-label">Day {day.dayNumber}</span>
                      <span className="day-date">{day.date}</span>
                    </div>
                    <ul className="day-activities">
                      {day.activities.map((act, index) => (
                        <li key={index}>
                          <span className="time">{act.time}</span>
                          <span className="title">{act.title}</span>
                          {act.note && <span className="note"> – {act.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {itinerary && activeTab !== 'overview' && (
            <div className="placeholder secondary">
              <p>
                <strong>{tabLabel(activeTab)}</strong> will be powered by the Claude agent and live travel APIs
                in the full version.
              </p>
              <p className="hint">
                In this hackathon prototype, these tabs are decorative UI to illustrate how deep booking details
                would be organized.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>Hackathon prototype – frontend only, wrapping a future Claude travel agent backend.</span>
      </footer>
    </div>
  );
}

// ---- Simple mock “AI” itinerary generator (pure frontend) ----

function buildItinerary(formData) {
  const { origin, destination, startDate, endDate, people, constraints } = formData;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const days = [];
  let current = new Date(start);

  let dayIndex = 1;
  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10); // YYYY-MM-DD

    const baseActivities = getBaseActivitiesForDay(dayIndex, destination, constraints);

    days.push({
      dayNumber: dayIndex,
      date: dateStr,
      activities: baseActivities,
    });

    current.setDate(current.getDate() + 1);
    dayIndex++;
  }

  return {
    origin,
    destination,
    startDate,
    endDate,
    peopleLabel: people === '1' ? 'Solo traveler' : `${people} travelers`,
    constraints: constraints.trim() || null,
    days,
  };
}

function getBaseActivitiesForDay(dayNumber, destination, constraints) {
  const constraintNote = constraints
    ? ` (while respecting: ${constraints.slice(0, 80)}${constraints.length > 80 ? '…' : ''})`
    : '';

  if (dayNumber === 1) {
    return [
      {
        time: 'Morning',
        title: `Arrival in ${destination}`,
        note: 'Check in, drop bags, grab a light snack.',
      },
      {
        time: 'Afternoon',
        title: `Neighborhood walk in central ${destination}`,
        note: 'Get oriented, find a local café.',
      },
      {
        time: 'Evening',
        title: 'Welcome dinner',
        note: `Pick a highly rated spot that fits your constraints${constraintNote}.`,
      },
    ];
  }

  if (dayNumber === 2) {
    return [
      {
        time: 'Morning',
        title: 'Flagship attraction',
        note: `Visit a must-see landmark or museum in ${destination}.`,
      },
      {
        time: 'Afternoon',
        title: 'Guided experience or tour',
        note: 'Structured activity to cover local highlights.',
      },
      {
        time: 'Evening',
        title: 'Relaxed downtime',
        note: `Explore a quieter area or park in ${destination}${constraintNote}.`,
      },
    ];
  }

  return [
    {
      time: 'Morning',
      title: 'Local exploration',
      note: `Try a neighborhood or district you haven’t seen in ${destination}.`,
    },
    {
      time: 'Afternoon',
      title: 'Activity block',
      note: `Book something aligned with your preferences${constraintNote}.`,
    },
    {
      time: 'Evening',
      title: 'Dinner & recap',
      note: 'Good restaurant + time to review the next day.',
    },
  ];
}

export default App;