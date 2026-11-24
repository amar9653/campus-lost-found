import { api, errorMessage, reportView } from '../../services/portal';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, CalendarDays } from 'lucide-react';
import '../../styles/Dashboard.css';

function SearchItems() {
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || 'All';

  const [prevParams, setPrevParams] = useState({ keyword: keywordParam, category: categoryParam });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(keywordParam);
  const [category, setCategory] = useState(categoryParam);
  const [type, setType] = useState('All');
  const [location, setLocation] = useState('All');
  const [date, setDate] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  if (prevParams.keyword !== keywordParam || prevParams.category !== categoryParam) {
    setPrevParams({ keyword: keywordParam, category: categoryParam });
    setSearch(keywordParam);
    setCategory(categoryParam);
  }

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (active) setLoading(true);
        const data = [];
        for (let page = 1; page <= 100; page++) {
          const response = await api.get('/reports', { params: { limit: 100, page } });
          const batch = Array.isArray(response.data?.data) ? response.data.data : [];
          data.push(...batch);
          const totalPages = Number(response.data?.pagination?.totalPages);
          if (Number.isFinite(totalPages) && totalPages > 0) {
            if (page >= totalPages) break;
          } else if (batch.length < 100) {
            break;
          }
        }
        if (active) {
          setItems(data.filter(r => ['lost', 'found'].includes(r.type) && r.status === 'approved').map(reportView));
          setLoadError('');
        }
      } catch (err) {
        if (active) {
          setItems([]);
          setLoadError(errorMessage(err));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    window.addEventListener('focus', load);
    return () => {
      active = false;
      window.removeEventListener('focus', load);
    };
  }, []);

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort();
  const locations = [...new Set(items.map(item => item.location).filter(Boolean))].sort();

  const filteredItems = items.filter(item => {
    const searchText = [item.itemName, item.category, item.description, item.location]
      .filter(Boolean).join(' ').toLowerCase();
    const itemType = String(item.type || '').toLowerCase();
    // eventDate is the original YYYY-MM-DD date from the backend.
    const itemDate = item.eventDate || item.lostDate || item.foundDate || '';
    return (
      searchText.includes(search.trim().toLowerCase()) &&
      (type === 'All' || itemType === type.toLowerCase()) &&
      (category === 'All' || item.category === category) &&
      (location === 'All' || item.location === location) &&
      (!date || String(itemDate).slice(0, 10) === date)
    );
  });

  const submitClaim = async item => {
    if (claimingId) return;
    if (!localStorage.getItem('studentToken')) {
      alert('Please log in to submit a claim.');
      return;
    }
    const ownershipExplanation = window.prompt('Describe how you can prove this item belongs to you (at least 10 characters):');
    if (ownershipExplanation === null) return;
    if (ownershipExplanation.trim().length < 10) {
      alert('Please provide at least 10 characters explaining ownership.');
      return;
    }
    try {
      setClaimingId(item.id);
      await api.post('/claims', { reportId: item.id, ownershipExplanation: ownershipExplanation.trim() });
      alert('Claim submitted to admin for review. Check My Claims for updates.');
    } catch (err) {
      alert(errorMessage(err));
    } finally {
      setClaimingId(null);
    }
  };

  const clearAll = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setLocation('All');
    setDate('');
  };

  return (
    <div className="reference-search-page">
      <div className="reference-search-card">
        <div className="reference-search-heading">
          <h2>Browse Lost &amp; Found Items</h2>
          <p>Search publicly available, admin-approved lost and found items. No login is required to browse.</p>
        </div>

        <form className="reference-search-bar" onSubmit={e => e.preventDefault()}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by item name, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="reference-filter-row">
          <select aria-label="Item type" value={type} onChange={e => setType(e.target.value)}>
            <option value="All">All Items</option>
            <option value="Lost">Lost Items</option>
            <option value="Found">Found Items</option>
          </select>

          <select aria-label="Category" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select aria-label="Location" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="All">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <input aria-label="Item date" type="date" value={date} onChange={e => setDate(e.target.value)} />

          <button className="reference-clear-button" onClick={clearAll} type="button">Clear All</button>
        </div>

        {loadError && <p role="alert">{loadError}</p>}
        <div className="reference-results-heading">
          <h3>Approved Lost &amp; Found Items</h3>
          <span>{filteredItems.length} items found</span>
        </div>

        {loading && <p role="status">Loading items...</p>}

        <div className="reference-items-grid">
          {filteredItems.map(item => {
            const isFound = String(item.type).toLowerCase() === 'found';
            return (
              <div className="reference-item-card" key={item.id}>
                <div className="reference-item-image">
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.itemName || item.name}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="text-center p-4">{isFound ? '📦' : '⚠️'}</div>
                  )}
                </div>

                <div className="reference-item-info">
                  <div className="reference-item-title">
                    <h4>{item.itemName || item.name}</h4>
                    <span className={`reference-status ${isFound ? 'found' : 'lost'}`}>
                      {isFound ? 'Found' : 'Lost'}
                    </span>
                  </div>

                  <p><MapPin size={15} />{item.location}</p>
                  <p><CalendarDays size={15} />{item.eventDate || item.lostDate || item.foundDate || item.date || 'Date unavailable'}</p>
                  <p>Category: {item.category}</p>

                  <button type="button" onClick={() => {
                    alert(
                      `Item: ${item.itemName || item.name}\n` +
                      `Type: ${isFound ? 'Found' : 'Lost'}\n` +
                      `Category: ${item.category}\n` +
                      `Location: ${item.location}\n` +
                      `Description: ${item.description || 'Not available'}`
                    );
                  }}>View Details</button>

                  {isFound && (
                    <button
                      type="button"
                      disabled={claimingId !== null}
                      onClick={() => submitClaim(item)}
                    >
                      {claimingId === item.id ? 'Submitting Claim...' : 'Claim This Item'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!loading && !loadError && filteredItems.length === 0 && (
          <div className="reference-no-results">
            <h3>No matching approved items available</h3>
            <p>Try another keyword or filter, or check again after new reports are approved by the administrator.</p>
            <button onClick={clearAll} type="button">Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchItems;
