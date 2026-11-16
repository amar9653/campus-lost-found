
import { useRef, useState } from 'react';

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

function CreateLostReport() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    lostDate: '',
    location: '',
    contact: ''
  });

  const [image, setImage] = useState(null);
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

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    console.log('Lost Item Report:', formData);
    console.log('Uploaded Image:', image);

    setMessage('Lost item report submitted successfully!');

    // Demo only. Connect your backend API here
    // to save the report permanently.
  };

  // Reset form
  const handleCancel = () => {
    setFormData({
      itemName: '',
      category: '',
      description: '',
      lostDate: '',
      location: '',
      contact: ''
    });

    removeImage();
    setError('');
    setMessage('');
  };

  return (
    <section
      className="lost-report-page"
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 15px',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="lost-report-card"
        style={{
          width: '100%',
          maxWidth: '580px',
          height: 'auto',
          padding: '20px 30px',
          margin: 'auto',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRadius: '18px'
        }}
      >

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

          {/* Single-column form */}
          <div
            className="report-form-grid"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: '9px'
            }}
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
                  <option value="Electronics">Electronics</option>
                  <option value="Bags">Bags</option>
                  <option value="Books & Notes">Books & Notes</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Documents">Documents</option>
                  <option value="Other">Other</option>
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
          <div
            className="report-actions"
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '12px'
            }}
          >
            <button
              type="submit"
              className="report-submit-btn"
            >
              <Send size={17} />
              Submit Lost Report
            </button>

            <button
              type="button"
              className="report-cancel-btn"
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
