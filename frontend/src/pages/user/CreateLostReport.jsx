import { api, getData, errorMessage } from '../../services/portal';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Search,
  Package,
  List,
  FileText,
  CalendarDays,
  MapPin,
  Phone,
  Upload,
  Send,
  X
} from 'lucide-react';

import '../../styles/Dashboard.css';

const DEFAULT_CATEGORIES = [
  'Mobile Phones',
  'Laptops',
  'Tablets',
  'Chargers',
  'Earphones',
  'Headphones',
  'Wallets',
  'Keys',
  'Watches',
  'ID Cards',
  'Documents',
  'Backpacks',
  'Bags',
  'Books',
  'Stationery',
  'Water Bottles',
  'Clothing',
  'Other'
];

function CreateLostReport() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    lostDate: '',
    location: '',
    contact: ''
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState(
    DEFAULT_CATEGORIES.map((name) => ({ _id: name, name }))
  );
  useEffect(() => {
    getData('/categories')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fileInputRef = useRef(null);

  const today = new Date();

  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
    setMessage('');
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.');
      e.target.value = '';
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
    setMessage('');
  };

  // Remove uploaded image
  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit report once; do not recreate it if the optional image upload fails.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    setMessage('');

    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!localStorage.getItem('studentToken')) {
      setError('Please log in before submitting a report.');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    let createdReportId = null;

    try {
      const response = await api.post('/reports', {
        type: 'lost',
        itemName: formData.itemName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        lostDate: formData.lostDate,
        location: formData.location.trim(),
        contact: formData.contact
      });
      createdReportId = response.data.data._id;

      if (image) {
        const data = new FormData();
        data.append('image', image);
        await api.post(`/reports/${createdReportId}/images`, data);
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (createdReportId) {
        setError(
          'Your report was submitted, but the image could not be uploaded. ' +
          'Please do not submit again. Return to the dashboard to view your report. ' +
          'Upload error: ' + errorMessage(err)
        );
      } else {
        setError(errorMessage(err));
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Cancel closes this report page instead of only clearing its fields.
  const handleCancel = () => {
    if (submittingRef.current) return;
    navigate('/dashboard');
  };

  return (
    <section className="lost-report-page">
      <div className="lost-report-card">

        {/* Heading */}
        <div
          className="lost-report-heading"
          style={{
            textAlign: 'center',
            marginBottom: '14px'
          }}
        >
          <div
            className="lost-report-icon"
            style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <Search size={30} strokeWidth={2} />
          </div>

          <h2>Report a Lost Item</h2>

          <p>
            Provide the details below to help us find your lost belonging.
          </p>
        </div>

        {/* Success message */}
        {message && (
          <div className="report-success-message" role="status">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="report-error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div
            className="report-form-grid"
          >

            {/* Item Name */}
            <div className="report-field">
              <label htmlFor="itemName">
                Item Name <span>*</span>
              </label>

              <div className="report-input-wrap">
                <Package />

                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="e.g. Black Backpack"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="report-field">
              <label htmlFor="category">
                Item Category <span>*</span>
              </label>

              <div className="report-input-wrap">
                <List />

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id || category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}

                  {!categories.some((c) => c.name?.toLowerCase() === 'other') && (
                    <option value="Other">Other</option>
                  )}

                </select>
              </div>
            </div>

            {/* Description */}
            <div className="report-field">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <div className="report-input-wrap report-textarea-wrap">
                <FileText />

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the item, colour, brand and identifying details..."
                  rows="2"
                  required
                />
              </div>
            </div>

            {/* Lost Date */}
            <div className="report-field">
              <label htmlFor="lostDate">
                Lost Date <span>*</span>
              </label>

              <div className="report-input-wrap">
                <CalendarDays />

                <input
                  type="date"
                  id="lostDate"
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleChange}
                  max={localToday}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="report-field">
              <label htmlFor="location">
                Last Seen Location <span>*</span>
              </label>

              <div className="report-input-wrap">
                <MapPin />

                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. College Library, Canteen, Block A"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="report-field">
              <label htmlFor="contact">
                Contact Number <span>*</span>
              </label>

              <div className="report-input-wrap">
                <Phone />

                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="report-field">
              <label htmlFor="itemImage">
                Upload Item Image <small>(Optional)</small>
              </label>

              <div className="report-input-wrap report-file-wrap">
                <Upload />

                <input
                  type="file"
                  id="itemImage"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />
              </div>

              <small className="report-help-text">
                Please upload a clear image of your lost item.
                (JPG/PNG, Max 5 MB)
              </small>

              {preview && (
                <div className="report-image-preview">
                  <img src={preview} alt="Lost item preview" />

                  <button type="button" onClick={removeImage}>
                    <X size={15} />
                    Remove Image
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="report-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="report-submit-btn"
            >
              <Send size={17} />
              {isSubmitting ? 'Submitting...' : 'Submit Lost Report'}
            </button>

            <button
              type="button"
              className="report-cancel-btn"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              <X size={17} />
              Cancel
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

export default CreateLostReport;