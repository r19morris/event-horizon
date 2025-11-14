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
  Ticket,
  Music2,
  Bus,
  Info
} from 'lucide-react';
import { sampleLaItinerarySeed } from './sampleLaItinerary';

function App() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    people: '2',
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

    // Pretend this came from the Claude + booking backend
    const generated = buildItineraryFromSeed(sampleLaItinerarySeed, formData);
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
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-badge">
            <Plane size={22} />
          </div>
          <div>
            <h1>Event Horizon</h1>
            <p>“the intelligent architect of your travel experience”</p>
          </div>
        </div>

        <div className="header-right">
          <div className="trip-history">
            <span className="chip chip-muted">Last trip: Paris → Lisbon</span>
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

      {/* MAIN */}
      <main className="app-main">
        {/* LEFT: FORM */}
        <section className="card card-form">
          <div className="card-title-with-icon">
            <div className="icon-circle">
              <MapPin size={18} />
            </div>
            <div>
              <h2>Trip Setup</h2>
              <p className="subtitle">
                Answer 4 key questions and optionally add constraints.
                For the demo, the AI returns a pop-culture itinerary for Los Angeles.
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
                placeholder="e.g., Los Angeles"
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

        {/* RIGHT: ITINERARY + TABS */}
        <section className="card card-output">
          <div className="card-title-with-icon">
            <div className="icon-circle icon-circle-secondary">
              <Clock size={18} />
            </div>
            <div>
              <h2>Itinerary</h2>
              <p className="subtitle">
                Calendar-style overview plus focused views for flights, hotels, events, and food.
              </p>
            </div>
          </div>

          {/* Tabs */}
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

          {/* No itinerary yet */}
          {!itinerary && (
            <div className="placeholder">
              <p>
                Fill in the trip details on the left and click <strong>Generate itinerary</strong>.
              </p>
              <ul>
                <li>Overview shows a calendar-style timeline</li>
                <li>Other tabs show how the agent deep-fills flights, hotels, events, and food</li>
                <li>Seed data simulates a Claude-powered itinerary for Los Angeles</li>
              </ul>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {itinerary && activeTab === 'overview' && (
            <>
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

              <div className="logistics">
                <h3>Logistics (agent-generated)</h3>
                <div className="logistics-row">
                  <div className="logistics-icon">
                    <Plane size={16} />
                  </div>
                  <div className="logistics-text">
                    <strong>Flights</strong>
                    <p>
                      In the full system, the Claude agent selects and books flight options that align with your
                      origin, dates, and constraints.
                    </p>
                  </div>
                </div>
                <div className="logistics-row">
                  <div className="logistics-icon">
                    <BedDouble size={16} />
                  </div>
                  <div className="logistics-text">
                    <strong>Accommodation</strong>
                    <p>
                      Focused around West Hollywood to balance nightlife, studio visits, and coastal access with
                      minimal intra-city travel.
                    </p>
                  </div>
                </div>
                <div className="logistics-row">
                  <div className="logistics-icon">
                    <Music2 size={16} />
                  </div>
                  <div className="logistics-text">
                    <strong>Experience theme</strong>
                    <p>
                      Pop-culture, music history, and iconic LA food experiences tailored to your preferences.
                    </p>
                  </div>
                </div>
                <div className="logistics-row">
                  <div className="logistics-icon">
                    <Bus size={16} />
                  </div>
                  <div className="logistics-text">
                    <strong>Ground transport</strong>
                    <p>
                      Mix of rideshare, walking, and light public transit; the agent can auto-insert transfer times
                      into the schedule.
                    </p>
                  </div>
                </div>
              </div>

              <div className="days">
                <h3>Calendar-style daily plan</h3>
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
                          {act.location && (
                            <span className="note"> – {act.location}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {itinerary.tips && (
                <div className="summary tips-block">
                  <div className="tips-header">
                    <Info size={16} />
                    <h3>Smart tips from the agent</h3>
                  </div>
                  <ul>
                    {itinerary.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* FLIGHTS TAB */}
          {itinerary && activeTab === 'flights' && (
            <div className="tab-section">
              <div className="tab-section-header">
                <Plane size={16} />
                <div>
                  <h3>Flight plan</h3>
                  <p>Outbound and return segments with smart deep links to booking providers.</p>
                </div>
              </div>
              <div className="card-grid">
                {itinerary.flights.map((flight) => (
                  <div key={flight.id} className="subcard flight-card">
                    <div className="subcard-header">
                      <span className="pill-label">{flight.label}</span>
                      <span className="pill-muted">{flight.airline}</span>
                    </div>
                    <div className="flight-main">
                      <span className="flight-city">
                        {flight.origin}
                      </span>
                      <span className="flight-arrow" />
                      <span className="flight-city">
                        {flight.destination}
                      </span>
                    </div>
                    <div className="flight-meta">
                      <span>{flight.date}</span>
                      <span>
                        {flight.departTime} – {flight.arriveTime}
                      </span>
                    </div>
                    <a
                      href={flight.deepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button"
                    >
                      Open in Google Flights
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOTELS TAB */}
          {itinerary && activeTab === 'hotels' && (
            <div className="tab-section">
              <div className="tab-section-header">
                <BedDouble size={16} />
                <div>
                  <h3>Hotel reservations</h3>
                  <p>Stays that match your neighborhood preferences and trip duration.</p>
                </div>
              </div>
              <div className="card-grid">
                {itinerary.hotels.map((hotel, i) => (
                  <div key={i} className="subcard hotel-card">
                    <div className="subcard-header">
                      <span className="pill-label">{hotel.name}</span>
                      <span className="pill-muted">{hotel.area}</span>
                    </div>
                    <div className="hotel-meta">
                      <span>{hotel.rating}★ guest rating</span>
                      <span>
                        {hotel.nights} nights · ~${hotel.pricePerNight}/night
                      </span>
                    </div>
                    <a
                      href={hotel.deepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-button"
                    >
                      View on Booking.com
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {itinerary && activeTab === 'events' && (
            <div className="tab-section">
              <div className="tab-section-header">
                <Ticket size={16} />
                <div>
                  <h3>Events & experiences</h3>
                  <p>Music venues, museums, studios, and iconic LA pop-culture stops.</p>
                </div>
              </div>
              <div className="list-block">
                {itinerary.events.map((ev, i) => (
                  <div key={i} className="row-block">
                    <div className="row-time">
                      <Calendar size={12} />
                      <span>{ev.date}</span>
                      <span className="dot" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="row-main">
                      <div className="row-title">{ev.activity}</div>
                      <div className="row-sub">
                        <MapPin size={12} />
                        <span>{ev.location}</span>
                      </div>
                      <p className="row-desc">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOD TAB */}
          {itinerary && activeTab === 'food' && (
            <div className="tab-section">
              <div className="tab-section-header">
                <UtensilsCrossed size={16} />
                <div>
                  <h3>Food & restaurants</h3>
                  <p>Curated cafes, brunch spots, and dinner locations along your route.</p>
                </div>
              </div>
              <div className="list-block">
                {itinerary.food.map((spot, i) => (
                  <div key={i} className="row-block">
                    <div className="row-time">
                      <Calendar size={12} />
                      <span>{spot.date}</span>
                      <span className="dot" />
                      <span>{spot.time}</span>
                    </div>
                    <div className="row-main">
                      <div className="row-title">{spot.activity}</div>
                      <div className="row-sub">
                        <MapPin size={12} />
                        <span>{spot.location}</span>
                      </div>
                      <p className="row-desc">
                        {spot.description} · <span className="row-price">~${spot.cost}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback (shouldn't normally show) */}
          {itinerary &&
            activeTab !== 'overview' &&
            !['flights', 'hotels', 'events', 'food'].includes(activeTab) && (
              <div className="placeholder secondary">
                <p>
                  <strong>{tabLabel(activeTab)}</strong> will be powered by the Claude agent and live travel APIs
                  in the full version.
                </p>
              </div>
            )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <span>Hackathon prototype – frontend only, wrapping a future Claude travel agent backend.</span>
      </footer>
    </div>
  );
}

/**
 * Transform the LA seed JSON + user input into the itinerary shape
 * the UI expects. This is pretending to be the Claude + booking layer.
 */
function buildItineraryFromSeed(seed, formData) {
  const { origin, destination, startDate, endDate, people, constraints } = formData;

  // Days / calendar
  const days = seed.daily_plans.map((day) => ({
    dayNumber: day.day_number,
    date: day.date,
    activities: day.items.map((item) => ({
      time: item.time,
      title: item.activity,
      location: item.location,
      note: item.description,
      cost: item.cost
    }))
  }));

  // Flatten items for events/food
  const allItems = seed.daily_plans.flatMap((day) =>
    day.items.map((item) => ({
      ...item,
      date: day.date
    }))
  );

  const foodKeywords = ['breakfast', 'lunch', 'dinner', 'brunch', 'hot dogs'];
  const food = allItems.filter((item) =>
    foodKeywords.some((word) => item.activity.toLowerCase().includes(word))
  );
  const events = allItems.filter(
    (item) =>
      !foodKeywords.some((word) => item.activity.toLowerCase().includes(word))
  );

  // Simple mock flights / hotels using user dates where possible
  const flights = [
    {
      id: 1,
      label: 'Inbound flight',
      origin: origin || 'Your origin',
      destination: destination || 'Los Angeles',
      date: startDate || seed.daily_plans[0].date,
      departTime: '07:00',
      arriveTime: '10:15',
      airline: 'Demo Air',
      deepLink:
        'https://www.google.com/travel/flights?q=flights+from+' +
        encodeURIComponent(origin || 'JFK') +
        '+to+' +
        encodeURIComponent(destination || 'LAX') +
        '+on+' +
        (startDate || seed.daily_plans[0].date)
    },
    {
      id: 2,
      label: 'Return flight',
      origin: destination || 'Los Angeles',
      destination: origin || 'Your origin',
      date: endDate || seed.daily_plans[seed.daily_plans.length - 1].date,
      departTime: '13:30',
      arriveTime: '21:45',
      airline: 'Demo Air',
      deepLink:
        'https://www.google.com/travel/flights?q=flights+from+' +
        encodeURIComponent(destination || 'LAX') +
        '+to+' +
        encodeURIComponent(origin || 'JFK') +
        '+on+' +
        (endDate || seed.daily_plans[seed.daily_plans.length - 1].date)
    }
  ];

  const hotels = [
    {
      name: 'West Hollywood Boutique Hotel',
      area: 'West Hollywood',
      rating: 4.6,
      nights: 3,
      pricePerNight: 320,
      deepLink:
        'https://www.booking.com/searchresults.html?ss=' +
        encodeURIComponent('West Hollywood Los Angeles') +
        '&checkin=' +
        (startDate || seed.daily_plans[0].date) +
        '&checkout=' +
        (endDate || seed.daily_plans[seed.daily_plans.length - 1].date) +
        '&group_adults=' +
        (Number(people) || 2)
    }
  ];

  return {
    origin,
    destination: destination || 'Los Angeles, CA',
    startDate: startDate || seed.daily_plans[0].date,
    endDate: endDate || seed.daily_plans[seed.daily_plans.length - 1].date,
    peopleLabel: people === '1' ? 'Solo traveler' : `${people} travelers`,
    constraints: constraints.trim() || 'Demo: pop-culture, music, and food-focused LA trip.',
    days,
    tips: seed.tips,
    flights,
    hotels,
    events,
    food
  };
}

export default App;