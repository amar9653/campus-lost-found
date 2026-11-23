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

function FoundItemReport() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    foundDate: '',
    location: '',
    contact: ''
  });

  const [image, setImage] = useState(null);
  const [categories,setCategories]=useState([]);
  useEffect(()=>{getData('/categories').then(setCategories).catch(()=>setCategories([]));},[]);
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

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG or WEBP image.');
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
        type: 'found',
        itemName: formData.itemName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        foundDate: formData.foundDate,
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

      <div className="lost-report-card found-report-card">

        {/* Heading */}
        <div className="lost-report-heading">

          <div className="lost-report-icon">
            <Search size={30} strokeWidth={2} />
          </div>

          <h2>Report a Found Item</h2>

          <p>
            Provide the details below to help us return
            the found item to its rightful owner.
          </p>

        </div>

        {/* Success Message */}
        {message && (
          <div className="report-success-message" role="status">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="report-error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="report-form-grid">

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
                  {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                  {!categories.some(c=>c.name==='Other') && <option value="Other">Other</option>}
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

            {/* Found Date */}
            <div className="report-field">
              <label htmlFor="foundDate">
                Found Date <span>*</span>
              </label>

              <div className="report-input-wrap">
                <CalendarDays />

                <input
                  type="date"
                  id="foundDate"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  max={localToday}
                  required
                />
              </div>
            </div>

            {/* Found Location */}
            <div className="report-field">
              <label htmlFor="location">
                Found Location <span>*</span>
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

            {/* Contact Number */}
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
                Please upload a clear image of the found item.
                (JPG/PNG/WEBP, Max 5 MB)
              </small>

              {preview && (
                <div className="report-image-preview">

                  <img
                    src={preview}
                    alt="Found item preview"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                  >
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
              {isSubmitting ? 'Submitting...' : 'Submit Found Report'}
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

export default FoundItemReport;