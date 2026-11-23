import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary', 'danger', 'success'
  icon = 'warning',
  requiresInput = false,
  inputLabel = '',
  inputValue = '',
  inputPlaceholder = '',
  onInputChange = () => {},
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" onClick={onCancel}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <div className="d-flex align-items-center gap-2">
            {icon === 'warning' && <AlertTriangle size={20} className="text-warning" />}
            {icon === 'danger' && <AlertTriangle size={20} className="text-danger" />}
            {icon === 'success' && <CheckCircle size={20} className="text-success" />}
            {icon === 'info' && <Info size={20} className="text-primary" />}
            <h6 className="mb-0 fw-bold">{title}</h6>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ fontSize: '0.8rem' }}
            onClick={onCancel}
          ></button>
        </div>

        <div className="modal-body-custom">
          <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>{message}</p>

          {requiresInput && (
            <div>
              <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
                {inputLabel} <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                autoFocus
              ></textarea>
            </div>
          )}
        </div>

        <div className="modal-footer-custom">
          <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            disabled={requiresInput && !inputValue.trim()}
            className={`btn btn-sm px-3 ${
              confirmVariant === 'danger'
                ? 'btn-danger'
                : confirmVariant === 'success'
                ? 'btn-success'
                : 'btn-primary'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

