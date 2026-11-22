import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  CheckSquare,
  FileText,
  User,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { claims, reports, updateClaimStatus } = useAdmin();

  const claim = claims.find((c) => c.id === id);
  const matchedReport = claim ? reports.find((r) => r.id === claim.reportId) : null;

  // Modals state
  const [modalType, setModalType] = useState(null); // 'review', 'approve', 'reject', 'complete', 'evidence'
  const [rejectionReason, setRejectionReason] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('Item handed over and signed at desk.');

  if (!claim) {
    return (
      <div className="admin-card text-center py-5">
        <h4 className="fw-bold text-dark">Claim Not Found</h4>
        <p className="text-muted">No claim records found with identifier "{id}".</p>
        <Link to="/admin/claims" className="btn btn-admin-primary mt-3">
          Back to Claim Management
        </Link>
      </div>
    );
  }

  const handleAction = () => {
    if (modalType === 'review') {
      updateClaimStatus(claim.id, 'Under Review', 'Admin moved claim into active evidence review');
    } else if (modalType === 'approve') {
      updateClaimStatus(claim.id, 'Approved', 'Ownership claim approved after verifying documents');
    } else if (modalType === 'reject') {
      updateClaimStatus(claim.id, 'Rejected', rejectionReason);
    } else if (modalType === 'complete') {
      updateClaimStatus(
        claim.id,
        'Completed',
        `Physical handover completed. ${handoverNotes}`,
        { receiver: claim.claimantName, timestamp: new Date().toISOString() }
      );
    }
    setModalType(null);
  };

  return (
    <div>
      {/* Top Header & Breadcrumb Navigation */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-secondary p-2 d-flex align-items-center"
            onClick={() => navigate('/admin/claims')}
            title="Back to Claims List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h2 className="fw-bold mb-0 text-navy" style={{ fontSize: '1.4rem' }}>
                Claim #{claim.id}
              </h2>
              <StatusBadge status={claim.status} />
            </div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
              Submitted on {claim.submissionDate} • Related Report: {claim.reportId}
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {claim.status === 'Pending' && (
            <button
              className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1"
              onClick={() => setModalType('review')}
            >
              <RotateCcw size={14} /> Move to Under Review
            </button>
          )}

          {(claim.status === 'Pending' || claim.status === 'Under Review') && (
            <>
              <button
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                onClick={() => setModalType('reject')}
              >
                <XCircle size={14} /> Reject Claim
              </button>
              <button
                className="btn btn-sm btn-success d-inline-flex align-items-center gap-1"
                onClick={() => setModalType('approve')}
              >
                <CheckCircle size={14} /> Approve Claim
              </button>
            </>
          )}

          {claim.status === 'Approved' && (
            <button
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
              onClick={() => setModalType('complete')}
            >
              <CheckSquare size={14} /> Complete Handover
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Claimant & Found Item Details */}
        <div className="col-lg-8">
          {/* Item & Claim Overview */}
          <div className="admin-card mb-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <FileText size={18} className="text-primary" /> Claimed Item Information
              </h3>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-3">
                {matchedReport?.image ? (
                  <img
                    src={matchedReport.image}
                    alt={claim.itemName}
                    className="w-100 rounded-3 border"
                    style={{ maxHeight: '140px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-light rounded-3 d-flex align-items-center justify-content-center text-muted"
                    style={{ height: '120px' }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <div className="col-md-9">
                <h4 className="fw-bold text-dark mb-1">{claim.itemName}</h4>
                <div className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Report Reference:</strong> {claim.reportId} (
                  {matchedReport?.category || 'General'})
                </div>
                {matchedReport && (
                  <div className="p-2 bg-light rounded text-muted" style={{ fontSize: '0.82rem' }}>
                    <strong>Original Report Description:</strong> {matchedReport.description}
                  </div>
                )}
              </div>
            </div>

            <div className="border-top pt-3">
              <h6 className="fw-bold text-navy mb-2" style={{ fontSize: '0.92rem' }}>
                Claimant's Ownership Explanation:
              </h6>
              <div className="p-3 bg-light rounded-3 text-dark mb-3" style={{ fontSize: '0.88rem' }}>
                "{claim.ownershipExplanation}"
              </div>

              <h6 className="fw-bold text-navy mb-2" style={{ fontSize: '0.92rem' }}>
                Identification & Distinguishing Marks:
              </h6>
              <div className="p-3 bg-light rounded-3 text-dark" style={{ fontSize: '0.88rem' }}>
                {claim.identificationDetails || 'No distinctive marks entered.'}
              </div>
            </div>
          </div>

          {/* Uploaded Evidence Section */}
          <div className="admin-card mb-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Shield size={18} className="text-primary" /> Uploaded Proof & Evidence
              </h3>
              {claim.evidenceAvailable && (
                <button
                  className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                  onClick={() => setModalType('evidence')}
                >
                  <ExternalLink size={13} /> View Full Preview
                </button>
              )}
            </div>

            {claim.evidenceAvailable ? (
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-light text-dark border">
                    Type: {claim.evidenceType}
                  </span>
                  <span className="text-success fw-semibold" style={{ fontSize: '0.82rem' }}>
                    ✓ Digital document attached
                  </span>
                </div>

                <div
                  className="border rounded-3 p-2 bg-light text-center cursor-pointer"
                  style={{ maxWidth: '420px', cursor: 'pointer' }}
                  onClick={() => setModalType('evidence')}
                >
                  <img
                    src={claim.evidenceUrl}
                    alt="Proof of ownership"
                    className="img-fluid rounded"
                    style={{ maxHeight: '220px', objectFit: 'contain' }}
                  />
                  <div className="text-muted mt-2" style={{ fontSize: '0.75rem' }}>
                    Click to zoom evidence
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-light rounded-3 text-center text-muted">
                <HelpCircle size={32} className="opacity-50 mb-2" />
                <p className="mb-0 fw-medium">No formal evidence or invoice uploaded with this claim.</p>
                <small>Claimant must present in-person verification at student services.</small>
              </div>
            )}
          </div>

          {/* Admin Remarks */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Administrator Assessment & Remarks</h3>
            </div>
            <div className="p-3 bg-light rounded-3 text-dark" style={{ fontSize: '0.88rem' }}>
              {claim.adminRemarks ? (
                <span>{claim.adminRemarks}</span>
              ) : (
                <span className="text-muted font-italic">No official administrative remarks recorded yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Claimant Profile & Timeline Audit */}
        <div className="col-lg-4">
          {/* Claimant Information Card */}
          <div className="admin-card mb-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <User size={18} className="text-primary" /> Claimant Information
              </h3>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="rounded-circle bg-navy text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 44, height: 44, background: '#142D50' }}
              >
                {claim.claimantName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">{claim.claimantName}</h6>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                  {claim.studentId}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2" style={{ fontSize: '0.83rem' }}>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Mail size={15} className="text-secondary" />
                <span>{claim.claimantEmail}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Phone size={15} className="text-secondary" />
                <span>{claim.claimantPhone}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted">
                <Shield size={15} className="text-secondary" />
                <span>{claim.department}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top text-center">
              <Link
                to={`/admin/users?search=${encodeURIComponent(claim.claimantName)}`}
                className="btn btn-sm btn-outline-secondary w-100"
                style={{ fontSize: '0.78rem' }}
              >
                View Student Profile & History →
              </Link>
            </div>
          </div>

          {/* Status History Timeline Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">
                <Clock size={18} className="text-primary" /> Claim Lifecycle Timeline
              </h3>
            </div>

            <div className="timeline-trail position-relative ps-3">
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  backgroundColor: '#E2E8F0'
                }}
              ></div>

              {(claim.history || []).map((step, idx) => (
                <div key={idx} className="position-relative mb-4 ps-3">
                  <div
                    style={{
                      position: 'absolute',
                      left: '-10px',
                      top: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor:
                        step.status === 'Approved'
                          ? '#10b981'
                          : step.status === 'Completed'
                          ? '#8b5cf6'
                          : step.status === 'Rejected'
                          ? '#ef4444'
                          : '#18A49D',
                      border: '2px solid #ffffff'
                    }}
                  ></div>

                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <StatusBadge status={step.status} />
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {step.date}
                      </span>
                    </div>
                    <div className="fw-semibold text-dark mt-1" style={{ fontSize: '0.8rem' }}>
                      By: {step.by}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {step.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Full View Modal */}
      {modalType === 'evidence' && (
        <div className="modal-backdrop-custom" onClick={() => setModalType(null)}>
          <div className="modal-content-custom" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h6 className="mb-0 fw-bold">Evidence: {claim.evidenceType}</h6>
              <button className="btn-close" onClick={() => setModalType(null)}></button>
            </div>
            <div className="modal-body-custom text-center">
              <img
                src={claim.evidenceUrl}
                alt="Document evidence"
                className="img-fluid rounded border"
                style={{ maxHeight: '480px' }}
              />
              <p className="mt-3 text-muted" style={{ fontSize: '0.85rem' }}>
                Uploaded by {claim.claimantName} ({claim.studentId}) on {claim.submissionDate}
              </p>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-sm btn-secondary" onClick={() => setModalType(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={modalType === 'review'}
        title="Move Claim to Under Review"
        message="Mark this claim as actively under review? The claimant can see that verification is in progress."
        confirmText="Confirm Under Review"
        confirmVariant="primary"
        icon="info"
        onConfirm={handleAction}
        onCancel={() => setModalType(null)}
      />

      <ConfirmationModal
        isOpen={modalType === 'approve'}
        title="Approve Ownership Claim"
        message={`Approve ownership claim for ${claim.claimantName}? The student will receive notification to collect the item.`}
        confirmText="Approve Claim"
        confirmVariant="success"
        icon="success"
        onConfirm={handleAction}
        onCancel={() => setModalType(null)}
      />

      <ConfirmationModal
        isOpen={modalType === 'reject'}
        title="Reject Claim"
        message="Specify the reason why this claim is being denied. This explanation will be documented."
        confirmText="Reject Claim"
        confirmVariant="danger"
        icon="danger"
        requiresInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="e.g. Serial number mismatch, incorrect answers to verification questions..."
        inputValue={rejectionReason}
        onInputChange={setRejectionReason}
        onConfirm={handleAction}
        onCancel={() => setModalType(null)}
      />

      {/* Handover Modal */}
      {modalType === 'complete' && (
        <div className="modal-backdrop-custom" onClick={() => setModalType(null)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h6 className="mb-0 fw-bold">Confirm Physical Handover</h6>
              <button className="btn-close" onClick={() => setModalType(null)}></button>
            </div>
            <div className="modal-body-custom">
              <p className="text-muted" style={{ fontSize: '0.88rem' }}>
                Confirm that <strong>"{claim.itemName}"</strong> has been physically handed back to{' '}
                <strong>{claim.claimantName}</strong> ({claim.studentId}).
              </p>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Handover Remarks / ID Verification Note
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setModalType(null)}>
                Cancel
              </button>
              <button className="btn btn-sm btn-success" onClick={handleAction}>
                Confirm Handover Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimDetails;

