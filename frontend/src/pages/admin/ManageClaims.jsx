import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileCheck,
  CheckSquare,
  RotateCcw
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { useAdmin } from '../../context/useAdmin';

const ManageClaims = () => {
  const { claims, updateClaimStatus } = useAdmin();
  const navigate = useNavigate();

  // Filter State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state for admin actions
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: null, // 'review', 'approve', 'reject', 'complete'
    claim: null,
    reason: '',
    handoverReceiver: '',
    handoverRemarks: ''
  });

  const filterTabs = [
    'All',
    'Pending',
    'Under Review',
    'Approved',
    'Rejected',
    'Completed',
    'Withdrawn'
  ];

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      // Tab filter
      if (activeTab !== 'All' && claim.status !== activeTab) {
        return false;
      }

      // Search Query: by Claim ID, Item Name, Claimant Name
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = claim.id.toLowerCase().includes(query);
        const matchesItem = claim.itemName.toLowerCase().includes(query);
        const matchesClaimant = claim.claimantName.toLowerCase().includes(query);
        if (!matchesId && !matchesItem && !matchesClaimant) {
          return false;
        }
      }

      // Date Filter
      if (dateFilter && claim.submissionDate !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [claims, activeTab, searchQuery, dateFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredClaims.slice(startIndex, startIndex + pageSize);
  }, [filteredClaims, currentPage]);

  const openActionModal = (type, claim) => {
    setActionModal({
      isOpen: true,
      type,
      claim,
      reason: '',
      handoverReceiver: claim.claimantName,
      handoverRemarks: 'Physical identification verified in admin office.'
    });
  };

  const handleExecuteAction = () => {
    const { type, claim, reason, handoverReceiver, handoverRemarks } = actionModal;
    if (!claim) return;

    if (type === 'review') {
      updateClaimStatus(claim.id, 'Under Review', 'Admin moved claim to active review');
    } else if (type === 'approve') {
      updateClaimStatus(claim.id, 'Approved', 'Proof of ownership validated by administration');
    } else if (type === 'reject') {
      updateClaimStatus(claim.id, 'Rejected', reason);
    } else if (type === 'complete') {
      updateClaimStatus(
        claim.id,
        'Completed',
        `Item handed over to ${handoverReceiver}. ${handoverRemarks}`,
        { receiver: handoverReceiver, timestamp: new Date().toISOString() }
      );
    }

    setActionModal({
      isOpen: false,
      type: null,
      claim: null,
      reason: '',
      handoverReceiver: '',
      handoverRemarks: ''
    });
  };

  const columns = [
    {
      header: 'Claim ID',
      accessor: 'id',
      width: '120px',
      render: (row) => (
        <span
          className="fw-bold text-primary cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/admin/claims/${row.id}`)}
        >
          {row.id}
        </span>
      )
    },
    {
      header: 'Item Name',
      render: (row) => (
        <div>
          <div className="fw-semibold text-dark">{row.itemName}</div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            Ref: {row.reportId}
          </div>
        </div>
      )
    },
    {
      header: 'Claimant Name',
      render: (row) => (
        <div>
          <div className="fw-medium text-dark">{row.claimantName}</div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            {row.studentId} • {row.department}
          </div>
        </div>
      )
    },
    {
      header: 'Claim Date',
      accessor: 'submissionDate'
    },
    {
      header: 'Evidence Available',
      render: (row) => (
        row.evidenceAvailable ? (
          <span className="badge bg-light text-success border border-success d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
            <FileCheck size={12} /> Yes ({row.evidenceType?.split(' ')[0] || 'Proof'})
          </span>
        ) : (
          <span className="badge bg-light text-secondary border d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
            No Proof
          </span>
        )
      )
    },
    {
      header: 'Claim Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="View Details"
            onClick={() => navigate(`/admin/claims/${row.id}`)}
          >
            <Eye size={15} />
          </button>

          {row.status === 'Pending' && (
            <button
              className="btn btn-sm btn-outline-info p-1"
              title="Move to Under Review"
              onClick={() => openActionModal('review', row)}
            >
              <RotateCcw size={15} />
            </button>
          )}

          {(row.status === 'Pending' || row.status === 'Under Review') && (
            <>
              <button
                className="btn btn-sm btn-outline-success p-1"
                title="Approve Claim"
                onClick={() => openActionModal('approve', row)}
              >
                <CheckCircle size={15} />
              </button>
              <button
                className="btn btn-sm btn-outline-danger p-1"
                title="Reject Claim"
                onClick={() => openActionModal('reject', row)}
              >
                <XCircle size={15} />
              </button>
            </>
          )}

          {row.status === 'Approved' && (
            <button
              className="btn btn-sm btn-outline-primary px-2 py-1 d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem' }}
              onClick={() => openActionModal('complete', row)}
            >
              <CheckSquare size={13} /> Complete Handover
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Top Filter Tabs */}
      <div className="admin-card mb-3 p-3">
        <div className="filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by ID, item, claimant..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <input
              type="date"
              className="admin-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              title="Filter by claim submission date"
            />

            {(searchQuery || dateFilter || activeTab !== 'All') && (
              <button
                className="btn btn-sm btn-link text-muted p-0 ms-2"
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('');
                  setActiveTab('All');
                  setCurrentPage(1);
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Showing {filteredClaims.length} filtered claims
            </span>
          </div>
        </div>

        {/* Claims Table */}
        <DataTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredClaims.length}
          onPageChange={setCurrentPage}
          emptyMessage="No claims found matching selected parameters"
        />
      </div>

      {/* Under Review Confirmation */}
      <ConfirmationModal
        isOpen={actionModal.isOpen && actionModal.type === 'review'}
        title="Move Claim to Under Review"
        message={`Move claim ${actionModal.claim?.id} for "${actionModal.claim?.itemName}" into active review status? This signals that an administrator is cross-checking evidence.`}
        confirmText="Confirm Under Review"
        confirmVariant="primary"
        icon="info"
        onConfirm={handleExecuteAction}
        onCancel={() => setActionModal({ isOpen: false, type: null, claim: null, reason: '' })}
      />

      {/* Approve Confirmation */}
      <ConfirmationModal
        isOpen={actionModal.isOpen && actionModal.type === 'approve'}
        title="Approve Claim Ownership"
        message={`Are you sure you want to approve ownership claim ${actionModal.claim?.id} for ${actionModal.claim?.claimantName}? The claimant will be invited to collect their item.`}
        confirmText="Approve Claim"
        confirmVariant="success"
        icon="success"
        onConfirm={handleExecuteAction}
        onCancel={() => setActionModal({ isOpen: false, type: null, claim: null, reason: '' })}
      />

      {/* Reject Modal with Reason */}
      <ConfirmationModal
        isOpen={actionModal.isOpen && actionModal.type === 'reject'}
        title="Reject Ownership Claim"
        message={`Provide a clear reason why claim ${actionModal.claim?.id} is being rejected. This note will be recorded in the claim audit log.`}
        confirmText="Reject Claim"
        confirmVariant="danger"
        icon="danger"
        requiresInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="e.g. Serial number mismatch, incorrect item description, fraudulent proof..."
        inputValue={actionModal.reason}
        onInputChange={(val) => setActionModal((prev) => ({ ...prev, reason: val }))}
        onConfirm={handleExecuteAction}
        onCancel={() => setActionModal({ isOpen: false, type: null, claim: null, reason: '' })}
      />

      {/* Handover Completion Modal */}
      {actionModal.isOpen && actionModal.type === 'complete' && (
        <div className="modal-backdrop-custom" onClick={() => setActionModal({ isOpen: false, type: null, claim: null })}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="d-flex align-items-center gap-2">
                <CheckSquare size={20} className="text-success" />
                <h6 className="mb-0 fw-bold">Confirm Item Handover Completion</h6>
              </div>
              <button
                className="btn-close"
                style={{ fontSize: '0.8rem' }}
                onClick={() => setActionModal({ isOpen: false, type: null, claim: null })}
              ></button>
            </div>
            <div className="modal-body-custom">
              <p className="text-muted mb-3" style={{ fontSize: '0.88rem' }}>
                Confirm that the item <strong>"{actionModal.claim?.itemName}"</strong> has been physically returned and inspected in person.
              </p>

              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Handed Over To (Student Name)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={actionModal.handoverReceiver}
                  onChange={(e) =>
                    setActionModal((prev) => ({ ...prev, handoverReceiver: e.target.value }))
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '0.82rem' }}>
                  Handover Notes & Physical Verification
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={actionModal.handoverRemarks}
                  onChange={(e) =>
                    setActionModal((prev) => ({ ...prev, handoverRemarks: e.target.value }))
                  }
                ></textarea>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setActionModal({ isOpen: false, type: null, claim: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={handleExecuteAction}
              >
                Confirm Handover & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClaims;

