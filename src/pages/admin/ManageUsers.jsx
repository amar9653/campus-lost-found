import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  Check
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { useAdmin } from '../../context/useAdmin';

const ManageUsers = () => {
  const { users, approveUserAccount, rejectUserAccount } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Selected User Modal for Detailed inspection
  const [viewUser, setViewUser] = useState(null);

  // Approval / Rejection Modal State
  const [approvalModal, setApprovalModal] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    user: null,
    reason: ''
  });

  const departments = useMemo(() => {
    const set = new Set(users.map((u) => u.department));
    return ['All', ...Array.from(set)];
  }, [users]);

  // Tab counters
  const pendingCount = users.filter((u) => u.status === 'Pending Approval').length;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const suspendedCount = users.filter((u) => u.status === 'Suspended').length;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Tab filter
      if (activeTab === 'Pending Approval' && u.status !== 'Pending Approval') return false;
      if (activeTab === 'Active' && u.status !== 'Active') return false;
      if (activeTab === 'Suspended' && u.status !== 'Suspended') return false;

      // Department filter
      if (selectedDept !== 'All' && u.department !== selectedDept) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesStudentId = u.studentId.toLowerCase().includes(q);
        const matchesId = u.id.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesStudentId && !matchesId) return false;
      }
      return true;
    });
  }, [users, activeTab, selectedDept, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage]);

  const handleExecuteApproval = () => {
    const { type, user, reason } = approvalModal;
    if (!user) return;

    if (type === 'approve') {
      approveUserAccount(user.id);
    } else if (type === 'reject') {
      rejectUserAccount(user.id, reason);
    }

    setApprovalModal({ isOpen: false, type: null, user: null, reason: '' });
  };

  const columns = [
    {
      header: 'USER ID',
      accessor: 'id',
      width: '100px',
      render: (row) => <span className="fw-semibold text-primary">{row.id}</span>
    },
    {
      header: 'FULL NAME',
      render: (row) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={row.avatar}
            alt={row.name}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div className="fw-semibold text-dark">{row.name}</div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              {row.role}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'COLLEGE EMAIL',
      accessor: 'email'
    },
    {
      header: 'STUDENT / STAFF ID',
      accessor: 'studentId'
    },
    {
      header: 'DEPARTMENT',
      accessor: 'department'
    },
    {
      header: 'REGISTRATION DATE',
      accessor: 'registrationDate'
    },
    {
      header: 'ACCOUNT STATUS',
      render: (row) => (
        <div>
          <StatusBadge status={row.status} />
          {row.status === 'Active' ? (
            <div className="text-success mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
              <Check size={11} /> Authorized to Claim &amp; Report
            </div>
          ) : (
            <div className="text-danger mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', fontWeight: 500 }}>
              <Lock size={11} /> Portal Access Locked
            </div>
          )}
        </div>
      )
    },
    {
      header: 'ACTIONS',
      align: 'right',
      render: (row) => (
        <div className="d-flex align-items-center justify-content-end gap-1 flex-wrap">
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="Inspect Account"
            onClick={() => setViewUser(row)}
          >
            <Eye size={15} />
          </button>

          {/* SuperAdmin Approval Controls for Pending Users */}
          {row.status === 'Pending Approval' ? (
            <>
              <button
                className="btn btn-sm btn-success px-2 py-1 d-inline-flex align-items-center gap-1 text-white fw-semibold"
                style={{ fontSize: '0.74rem' }}
                title="Approve student account so they can claim and report"
                onClick={() => setApprovalModal({ isOpen: true, type: 'approve', user: row, reason: '' })}
              >
                <CheckCircle size={13} /> Approve Account
              </button>
              <button
                className="btn btn-sm btn-outline-danger px-2 py-1 d-inline-flex align-items-center gap-1"
                style={{ fontSize: '0.74rem' }}
                title="Reject Registration"
                onClick={() => setApprovalModal({ isOpen: true, type: 'reject', user: row, reason: '' })}
              >
                <XCircle size={13} /> Reject
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-outline-primary px-2 py-1"
                style={{ fontSize: '0.75rem' }}
                title="View Reports by this user"
                onClick={() => navigate(`/admin/reports?search=${encodeURIComponent(row.name)}`)}
              >
                Reports ({row.reportsCount})
              </button>
              <button
                className="btn btn-sm btn-outline-info px-2 py-1"
                style={{ fontSize: '0.75rem' }}
                title="View Claims by this user"
                onClick={() => navigate(`/admin/claims?search=${encodeURIComponent(row.name)}`)}
              >
                Claims ({row.claimsCount})
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      {/* SuperAdmin Approval Alert Banner if registrations are waiting */}
      {pendingCount > 0 && (
        <div className="alert alert-warning border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-white rounded-circle text-warning shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                {pendingCount} New Account Registration{pendingCount > 1 ? 's' : ''} Awaiting SuperAdmin Approval
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                Students cannot submit lost/found reports or claim items until their campus ID credentials are verified and approved.
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-dark px-3 fw-semibold"
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveTab('Pending Approval')}
          >
            Review Pending Users ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter Tabs matching SaaS reference */}
      <div className="custom-card mb-3 p-3">
        <div className="filter-tabs">
          {[
            { label: 'All Users', val: 'All', count: users.length },
            { label: 'Pending Approval', val: 'Pending Approval', count: pendingCount, badge: true },
            { label: 'Active Users', val: 'Active', count: activeCount },
            { label: 'Suspended Users', val: 'Suspended', count: suspendedCount }
          ].map((tab) => (
            <button
              key={tab.val}
              className={`filter-tab-btn ${activeTab === tab.val ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.val);
                setCurrentPage(1);
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="custom-card">
        {/* Filters and Search Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, email, student ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="admin-select"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>

            {(searchQuery || selectedDept !== 'All' || activeTab !== 'All') && (
              <button
                className="btn btn-sm btn-link text-muted p-0 ms-2"
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDept('All');
                  setActiveTab('All');
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Showing {filteredUsers.length} total users
            </span>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={paginatedData}
          keyField="id"
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
          emptyMessage="No users found matching your search"
        />
      </div>

      {/* User Details & ID Proof Modal */}
      {viewUser && (
        <div className="modal-backdrop-custom" onClick={() => setViewUser(null)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h6 className="mb-0 fw-bold">Student Account &amp; Verification Details</h6>
              <button className="btn-close" onClick={() => setViewUser(null)}></button>
            </div>
            <div className="modal-body-custom">
              <div className="d-flex align-items-center gap-3 mb-4">
                <img
                  src={viewUser.avatar}
                  alt={viewUser.name}
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h5 className="fw-bold mb-1 text-dark">{viewUser.name}</h5>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="badge bg-light text-dark border">{viewUser.role}</span>
                    <StatusBadge status={viewUser.status} />
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {viewUser.status === 'Pending Approval' ? (
                <div className="p-3 bg-light rounded-3 border mb-3 text-warning">
                  <div className="fw-bold d-flex align-items-center gap-1">
                    <Clock size={16} /> Awaiting SuperAdmin Approval
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                    This user registered recently. Once approved, they will receive full rights to report lost/found items and file claims.
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-light rounded-3 border mb-3 text-success">
                  <div className="fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                    <CheckCircle size={15} /> Verified Student Account • Full Access Granted
                  </div>
                </div>
              )}

              <div className="row g-2 mb-3" style={{ fontSize: '0.85rem' }}>
                <div className="col-6 text-muted">User ID:</div>
                <div className="col-6 fw-semibold text-dark">{viewUser.id}</div>

                <div className="col-6 text-muted">College Email:</div>
                <div className="col-6 fw-semibold text-dark">{viewUser.email}</div>

                <div className="col-6 text-muted">Student / Staff ID:</div>
                <div className="col-6 fw-semibold text-dark">{viewUser.studentId}</div>

                <div className="col-6 text-muted">Department:</div>
                <div className="col-6 fw-semibold text-dark">{viewUser.department}</div>

                <div className="col-6 text-muted">Registration Date:</div>
                <div className="col-6 fw-semibold text-dark">{viewUser.registrationDate}</div>

                <div className="col-6 text-muted">Claim &amp; Report Privileges:</div>
                <div className="col-6 fw-bold">
                  {viewUser.canReportAndClaim ? (
                    <span className="text-success">Enabled (Active)</span>
                  ) : (
                    <span className="text-danger">Disabled (Pending Approval)</span>
                  )}
                </div>
              </div>

              {/* Action buttons inside details modal */}
              {viewUser.status === 'Pending Approval' && (
                <div className="d-flex gap-2 pt-3 border-top">
                  <button
                    className="btn btn-sm btn-success flex-grow-1 text-white fw-semibold"
                    onClick={() => {
                      approveUserAccount(viewUser.id);
                      setViewUser((prev) => ({ ...prev, status: 'Active', canReportAndClaim: true }));
                    }}
                  >
                    <CheckCircle size={15} className="me-1" /> Approve Account by SuperAdmin
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      rejectUserAccount(viewUser.id, 'Identity verification failed');
                      setViewUser(null);
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer-custom">
              <button className="btn btn-sm btn-secondary" onClick={() => setViewUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for SuperAdmin Approval */}
      <ConfirmationModal
        isOpen={approvalModal.isOpen && approvalModal.type === 'approve'}
        title="Approve Student Account"
        message={`Are you sure you want to approve ${approvalModal.user?.name} (${approvalModal.user?.studentId})? Their account status will transition to Active, allowing them to report lost items, report found items, and claim products.`}
        confirmText="Confirm & Approve Account"
        confirmVariant="success"
        icon="success"
        onConfirm={handleExecuteApproval}
        onCancel={() => setApprovalModal({ isOpen: false, type: null, user: null, reason: '' })}
      />

      {/* Rejection Modal with Reason */}
      <ConfirmationModal
        isOpen={approvalModal.isOpen && approvalModal.type === 'reject'}
        title="Reject Registration"
        message={`Specify the reason for denying registration for ${approvalModal.user?.name}.`}
        confirmText="Reject Account"
        confirmVariant="danger"
        icon="danger"
        requiresInput={true}
        inputLabel="Reason for Rejection"
        inputPlaceholder="e.g. Invalid college email, student ID not found in campus database..."
        inputValue={approvalModal.reason}
        onInputChange={(val) => setApprovalModal((prev) => ({ ...prev, reason: val }))}
        onConfirm={handleExecuteApproval}
        onCancel={() => setApprovalModal({ isOpen: false, type: null, user: null, reason: '' })}
      />
    </div>
  );
};

export default ManageUsers;
