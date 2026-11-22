import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Archive
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { useAdmin } from '../../context/AdminContext';

const ManageReports = () => {
  const { reports, categories, updateReportStatus, archiveReport } = useAdmin();

  // Filters & Search State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal interaction state
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'approve', 'reject', 'archive', 'hide', 'view'
    report: null,
    reason: ''
  });

  const filterTabs = [
    'All',
    'Lost',
    'Found',
    'Pending',
    'Approved',
    'Rejected',
    'Withdrawn',
    'Archived'
  ];

  // Filtering Logic
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Tab filter
      if (activeTab === 'Lost' && item.type !== 'Lost') return false;
      if (activeTab === 'Found' && item.type !== 'Found') return false;
      if (
        ['Pending', 'Approved', 'Rejected', 'Withdrawn', 'Archived'].includes(activeTab) &&
        item.status !== activeTab
      ) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.itemName.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesReporter = item.reportedBy.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesReporter && !matchesLocation) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All' && item.type !== selectedType) {
        return false;
      }

      // Date filter
      if (dateFilter && item.date !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [reports, activeTab, searchQuery, selectedCategory, selectedType, dateFilter]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReports.slice(startIndex, startIndex + pageSize);
  }, [filteredReports, currentPage]);

  const handleOpenModal = (type, report) => {
    setModalState({
      isOpen: true,
      type,
      report,
      reason: ''
    });
  };

  const handleConfirmAction = () => {
    const { type, report, reason } = modalState;
    if (!report) return;

    if (type === 'approve') {
      updateReportStatus(report.id, 'Approved');
    } else if (type === 'reject') {
      updateReportStatus(report.id, 'Rejected', reason);
    } else if (type === 'archive') {
      archiveReport(report.id);
    } else if (type === 'hide') {
      updateReportStatus(report.id, 'Withdrawn', 'Hidden by Administrator');
    }

    setModalState({ isOpen: false, type: null, report: null, reason: '' });
  };

  const columns = [
    {
      header: 'Report ID',
      accessor: 'id',
      width: '120px',
      render: (row) => <span className="fw-semibold text-primary">{row.id}</span>
    },
    {
      header: 'Item Image',
      width: '80px',
      render: (row) => (
        <img
          src={row.image}
          alt={row.itemName}
          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
        />
      )
    },
    {
      header: 'Item Name',
      render: (row) => (
        <div>
          <div className="fw-semibold text-dark">{row.itemName}</div>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
            {row.description.slice(0, 48)}...
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      render: (row) => <StatusBadge type={row.type} />
    },
    {
      header: 'Category',
      accessor: 'category'
    },
    {
      header: 'Reported By',
      render: (row) => (
        <div>
          <div className="fw-medium text-dark">{row.reportedBy}</div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>
            {row.reporterEmail}
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      render: (row) => (
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
          {row.location}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'date'
    },
    {
      header: 'Status',
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
            onClick={() => handleOpenModal('view', row)}
          >
            <Eye size={15} />
          </button>
          {row.status === 'Pending' && (
            <>
              <button
                className="btn btn-sm btn-outline-success p-1"
                title="Approve Report"
                onClick={() => handleOpenModal('approve', row)}
              >
                <CheckCircle size={15} />
              </button>
              <button
                className="btn btn-sm btn-outline-danger p-1"
                title="Reject Report"
                onClick={() => handleOpenModal('reject', row)}
              >
                <XCircle size={15} />
              </button>
            </>
          )}
          {row.status !== 'Archived' && (
            <button
              className="btn btn-sm btn-outline-dark p-1"
              title="Archive Report"
              onClick={() => handleOpenModal('archive', row)}
            >
              <Archive size={15} />
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

      {/* Toolbar & Filter Bar */}
      <div className="admin-card">
        <div className="admin-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by ID, item, student..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="admin-select"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Types</option>
              <option value="Lost">Lost Only</option>
              <option value="Found">Found Only</option>
            </select>

            <input
              type="date"
              className="admin-select"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              title="Filter by report date"
            />

            {(searchQuery || selectedCategory !== 'All' || selectedType !== 'All' || dateFilter) && (
              <button
                className="btn btn-sm btn-link text-muted p-0 ms-2"
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedType('All');
                  setDateFilter('');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Showing {filteredReports.length} total reports
            </span>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredReports.length}
          onPageChange={setCurrentPage}
          emptyMessage="No reports found matching your criteria"
        />
      </div>

      {/* Confirmation & Details Modals */}
      {modalState.isOpen && modalState.type === 'view' && (
        <div className="modal-backdrop-custom" onClick={() => setModalState({ isOpen: false, type: null, report: null })}>
          <div className="modal-content-custom" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h6 className="mb-0 fw-bold">Report Details - {modalState.report?.id}</h6>
              <button
                className="btn-close"
                style={{ fontSize: '0.8rem' }}
                onClick={() => setModalState({ isOpen: false, type: null, report: null })}
              ></button>
            </div>
            <div className="modal-body-custom">
              <div className="d-flex gap-3 mb-3">
                <img
                  src={modalState.report?.image}
                  alt=""
                  style={{ width: 110, height: 110, borderRadius: 10, objectFit: 'cover' }}
                />
                <div>
                  <h5 className="fw-bold mb-1">{modalState.report?.itemName}</h5>
                  <div className="d-flex gap-2 mb-2">
                    <StatusBadge type={modalState.report?.type} />
                    <StatusBadge status={modalState.report?.status} />
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    <strong>Category:</strong> {modalState.report?.category}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    <strong>Location:</strong> {modalState.report?.location}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-3" style={{ fontSize: '0.85rem' }}>
                <div className="fw-semibold text-dark mb-1">Item Description:</div>
                <p className="text-muted mb-0">{modalState.report?.description}</p>
              </div>

              <div className="row g-2" style={{ fontSize: '0.82rem' }}>
                <div className="col-6">
                  <strong>Reported By:</strong> {modalState.report?.reportedBy}
                </div>
                <div className="col-6">
                  <strong>Contact Email:</strong> {modalState.report?.reporterEmail}
                </div>
                <div className="col-6">
                  <strong>Submission Date:</strong> {modalState.report?.date}
                </div>
                <div className="col-6">
                  <strong>Contact Phone:</strong> {modalState.report?.contactNumber}
                </div>
              </div>
            </div>
            <div className="modal-footer-custom">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setModalState({ isOpen: false, type: null, report: null })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'approve'}
        title="Approve Report"
        message={`Are you sure you want to approve "${modalState.report?.itemName}" (${modalState.report?.id})? It will become publicly visible across the student portal.`}
        confirmText="Approve Report"
        confirmVariant="success"
        icon="success"
        onConfirm={handleConfirmAction}
        onCancel={() => setModalState({ isOpen: false, type: null, report: null })}
      />

      {/* Reject Confirmation Modal with reason */}
      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'reject'}
        title="Reject Report"
        message={`Please provide a valid moderation reason for rejecting "${modalState.report?.itemName}".`}
        confirmText="Reject Report"
        confirmVariant="danger"
        icon="danger"
        requiresInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="e.g. Duplicate report, insufficient description, prohibited item..."
        inputValue={modalState.reason}
        onInputChange={(val) => setModalState((prev) => ({ ...prev, reason: val }))}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalState({ isOpen: false, type: null, report: null })}
      />

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'archive'}
        title="Archive Report"
        message={`Are you sure you want to archive report ${modalState.report?.id}? Archived reports are retained for historical records but removed from active listings.`}
        confirmText="Archive Report"
        confirmVariant="primary"
        icon="warning"
        onConfirm={handleConfirmAction}
        onCancel={() => setModalState({ isOpen: false, type: null, report: null })}
      />
    </div>
  );
};

export default ManageReports;

