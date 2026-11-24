
import { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const ManageCategories = () => {
  const {
    categories,
    reports,
    addCategory,
    updateCategory,
    deleteCategory
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Count actual Lost + Found reports by category
  const categoryCounts = useMemo(() => {
    const counts = {};

    reports.forEach((report) => {
      const name = String(report.category || '').trim().toLowerCase();

      if (name) {
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    return counts;
  }, [reports]);

  const getCategoryCount = (name) =>
    categoryCounts[String(name || '').trim().toLowerCase()] || 0;

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.toLowerCase();

    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const openAddModal = () => {
    setModalMode('add');
    setSelectedCat(null);
    setCategoryName('');
    setCategoryDesc('');
    setFormError('');
  };

  const openEditModal = (cat) => {
    setModalMode('edit');
    setSelectedCat(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setFormError('');
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setFormError('');

    if (modalMode === 'add') {
      const success = await addCategory(
        categoryName.trim(),
        categoryDesc
      );

      if (success) setModalMode(null);
    } else if (modalMode === 'edit') {
      const success = await updateCategory(
        selectedCat._id,
        categoryName.trim(),
        categoryDesc
      );

      if (success) setModalMode(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const count = getCategoryCount(deleteTarget.name);

    if (count > 0) {
      setDeleteTarget(null);
      setFormError('');
      alert(
        `Cannot delete "${deleteTarget.name}" because ${count} report(s) use this category.`
      );
      return;
    }

    const success = await deleteCategory(deleteTarget._id);

    if (success) {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="admin-card">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-input">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-right">
            <button
              className="btn-admin-primary"
              onClick={openAddModal}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid / Cards */}
        <div className="row g-3">
          {filteredCategories.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <Layers
                size={36}
                className="opacity-50 mb-2"
              />
              <p className="mb-0">
                No categories found matching your query.
              </p>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="col-md-6 col-lg-4"
              >
                <div
                  className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: 32,
                            height: 32,
                            backgroundColor: '#E7F6F5',
                            color: '#18A49D'
                          }}
                        >
                          <Tag size={16} />
                        </div>

                        <h6 className="fw-bold mb-0 text-dark">
                          {cat.name}
                        </h6>
                      </div>

                      <span className="badge bg-white text-dark border">
                        {getCategoryCount(cat.name)} Items
                      </span>
                    </div>

                    <p
                      className="text-muted mb-3"
                      style={{
                        fontSize: '0.82rem',
                        minHeight: '36px'
                      }}
                    >
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
                    <button
                      className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => openEditModal(cat)}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <div
          className="modal-backdrop-custom"
          onClick={() => setModalMode(null)}
        >
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSaveCategory}>
              <div className="modal-header-custom">
                <h6 className="mb-0 fw-bold">
                  {modalMode === 'add'
                    ? 'Add New Category'
                    : `Edit Category: ${selectedCat?.name}`}
                </h6>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalMode(null)}
                ></button>
              </div>

              <div className="modal-body-custom">
                {formError && (
                  <div
                    className="alert alert-danger py-2 px-3 d-flex align-items-center gap-2"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <AlertCircle size={16} />
                    {formError}
                  </div>
                )}

                <div className="mb-3">
                  <label
                    className="form-label fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Category Name{' '}
                    <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Headphones & Audio"
                    value={categoryName}
                    onChange={(e) =>
                      setCategoryName(e.target.value)
                    }
                    autoFocus
                  />
                </div>

                <div className="mb-2">
                  <label
                    className="form-label fw-semibold"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Description & Item Types
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe what kind of items belong in this category..."
                    value={categoryDesc}
                    onChange={(e) =>
                      setCategoryDesc(e.target.value)
                    }
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setModalMode(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                >
                  {modalMode === 'add'
                    ? 'Create Category'
                    : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"? Categories used by existing reports cannot be deleted.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        icon="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageCategories;
