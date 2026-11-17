
import React, { useState } from 'react';
import {
  Search, MapPin, CalendarDays
} from 'lucide-react';
import '../../styles/Dashboard.css';

const items = [
  {
    id: 1,
    name: 'Black Backpack',
    category: 'Bags',
    status: 'Lost',
    location: 'Library',
    date: '2026-11-10',
    image: '/items/backpack.jpg'
  },
  {
    id: 2,
    name: 'AirPods',
    category: 'Electronics',
    status: 'Found',
    location: 'Cafeteria',
    date: '2026-11-08',
    image: '/items/airpods.jpg'
  },
  {
    id: 3,
    name: 'Wallet',
    category: 'Accessories',
    status: 'Lost',
    location: 'Admin Block',
    date: '2026-11-06',
    image: '/items/wallet.jpg'
  }
];

function SearchItems() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || item.category === category) &&
    (location === 'All' || item.location === location) &&
    (status === 'All' || item.status === status) &&
    (!date || item.date === date)
  );

  const clearAll = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setStatus('All');
    setDate('');
  };

  return (
    <div className="reference-search-page">

      <div className="reference-search-card">

        <div className="reference-search-heading">
          <h2>Search Lost & Found Items</h2>
          <p>Find items using filters and keywords.</p>
        </div>

        {/* Search Bar */}
        <div className="reference-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by item name, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="button">Search</button>
        </div>

        {/* Horizontal Filters */}
        <div className="reference-filter-row">

          <select value={category}
            onChange={e => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Bags">Bags</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select value={location}
            onChange={e => setLocation(e.target.value)}>
            <option value="All">All Locations</option>
            <option value="Library">Library</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="Admin Block">Admin Block</option>
          </select>

          <select value={status}
            onChange={e => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button className="reference-clear-button"
            onClick={clearAll} type="button">
            Clear All
          </button>
        </div>

        {/* Results */}
        <div className="reference-results-heading">
          <h3>Recently Reported Items</h3>
          <span>{filteredItems.length} items found</span>
        </div>

        <div className="reference-items-grid">
          {filteredItems.map(item => (
            <div className="reference-item-card" key={item.id}>

              <div className="reference-item-image">
                <img src={item.image} alt={item.name}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }} />
              </div>

              <div className="reference-item-info">
                <div className="reference-item-title">
                  <h4>{item.name}</h4>
                  <span className={`reference-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>

                <p><MapPin size={15} /> {item.location}</p>
                <p><CalendarDays size={15} /> {item.date}</p>

                <button type="button"
                  onClick={() => alert(`Item: ${item.name}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="reference-no-results">
            <h3>No items found</h3>
            <p>Try another keyword or change your filters.</p>
            <button onClick={clearAll}>Clear All Filters</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchItems;
