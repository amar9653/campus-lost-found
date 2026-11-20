
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, CalendarDays
} from 'lucide-react';

import '../../styles/Dashboard.css';

function SearchItems() {
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(
    searchParams.get('keyword') || ''
  );
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [location, setLocation] = useState('All');
  const [date, setDate] = useState('');

  // Load approved found items
  useEffect(() => {
    const loadItems = () => {
      const savedReports = JSON.parse(
        localStorage.getItem('campusLostReports') || '[]'
      );

      const approvedFoundItems = savedReports.filter(item =>
        item.type === 'Found' &&
        item.status?.toLowerCase() === 'approved'
      );

      setItems(approvedFoundItems);
    };

    loadItems();

    window.addEventListener('focus', loadItems);

    return () => {
      window.removeEventListener('focus', loadItems);
    };
  }, []);

  // Update filters when Home page URL changes
  useEffect(() => {
    setSearch(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Get unique categories and locations
  const categories = [
    ...new Set(items.map(item => item.category).filter(Boolean))
  ];

  const locations = [
    ...new Set(items.map(item => item.location).filter(Boolean))
  ];

  // Filter items
  const filteredItems = items.filter(item => {
    const itemName = item.itemName || item.name || '';

    const itemDate = item.foundDate || item.date || '';

    const searchText = [
      itemName,
      item.category,
      item.description,
      item.location
    ].join(' ').toLowerCase();

    return (
      searchText.includes(search.toLowerCase()) &&
      (category === 'All' || item.category === category) &&
      (location === 'All' || item.location === location) &&
      (!date || itemDate === date)
    );
  });

  const clearAll = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setDate('');
  };

  return (
    <div className="reference-search-page">
      <div className="reference-search-card">

        <div className="reference-search-heading">
          <h2>Browse Found Items</h2>
          <p>
            Search publicly available, admin-approved found items.
            No login is required to browse.
          </p>
        </div>

        {/* Search Bar */}
        <form
          className="reference-search-bar"
          onSubmit={e => e.preventDefault()}
        >
          <Search size={20} />

          <input
            type="text"
            placeholder="Search by item name, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        {/* Filters */}
        <div className="reference-filter-row">

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>

            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
          >
            <option value="All">All Locations</option>

            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <button
            className="reference-clear-button"
            onClick={clearAll}
            type="button"
          >
            Clear All
          </button>

        </div>

        {/* Results */}
        <div className="reference-results-heading">
          <h3>Approved Found Items</h3>
          <span>{filteredItems.length} items found</span>
        </div>

        <div className="reference-items-grid">

          {filteredItems.map(item => (
            <div
              className="reference-item-card"
              key={item.id}
            >

              <div className="reference-item-image">
                {item.imageUrl || item.image ? (
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.itemName || item.name}
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    📦
                  </div>
                )}
              </div>

              <div className="reference-item-info">

                <div className="reference-item-title">
                  <h4>{item.itemName || item.name}</h4>

                  <span className="reference-status found">
                    Found
                  </span>
                </div>

                <p>
                  <MapPin size={15} />
                  {item.location}
                </p>

                <p>
                  <CalendarDays size={15} />
                  {item.foundDate || item.date || 'Date unavailable'}
                </p>

                <p>
                  Category: {item.category}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    alert(
                      `Item: ${item.itemName || item.name}\n` +
                      `Category: ${item.category}\n` +
                      `Location: ${item.location}\n` +
                      `Description: ${item.description || 'Not available'}`
                    );
                  }}
                >
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>

        {filteredItems.length === 0 && (
          <div className="reference-no-results">
            <h3>No approved found items available</h3>
            <p>
              Try another keyword or category, or check again
              after new reports are approved by the administrator.
            </p>

            <button onClick={clearAll} type="button">
              Clear All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchItems;
