import { useEffect, useState } from "react";
import axios from "axios";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

type Category = {
  _id: string;
  name: string;
};

interface Props {
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
  refreshTrigger?: number;
  onTriggerRefresh?: () => void;
  userInfo?: any;
}

const Sidebar = ({
  activeCategoryId,
  onSelect,
  refreshTrigger,
  onTriggerRefresh,
  userInfo,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const API = process.env.REACT_APP_API_BASE_URL;

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  const handleRename = async (id: string) => {
    if (!newName.trim()) return;
    await axios.put(`${API}/categories/${id}`, { name: newName });
    setEditingId(null);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await axios.delete(`${API}/categories/${categoryToDelete._id}`);
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    fetchCategories();
    onSelect("");
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    await axios.post(`${API}/categories`, { name: newCategoryName });
    setNewCategoryName("");
    setShowAddModal(false);
    if (onTriggerRefresh) onTriggerRefresh();
  };

  return (
    <div className="w-64 h-full bg-white border-r overflow-y-auto p-4 shadow-md relative">
      {userInfo && (
        <div className="mb-6 text-sm text-gray-700 border-b pb-4 text-center">
          <img
            src="https://avatars.slack-edge.com/2023-01-27/4733489633024_675bb343be96883ef7b2_88.png"
            alt="Department Logo"
            className="mx-auto w-10 h-10 rounded-full mb-2"
          />
          <h1 className="text-base font-semibold">
            {userInfo.department} Repository
          </h1>
          <p className="text-xs text-gray-500">{userInfo.email}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-blue-600 hover:text-blue-800"
          title="Add Category"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
              activeCategoryId === cat._id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onMouseEnter={() => setHoveredId(cat._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {editingId === cat._id ? (
              <input
                className="flex-grow mr-2 text-sm px-2 py-1 rounded border border-gray-300"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleRename(cat._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(cat._id);
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => onSelect(cat._id)}
                className="flex-grow text-sm truncate"
              >
                {cat.name}
              </span>
            )}

            {hoveredId === cat._id && (
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingId(cat._id);
                    setNewName(cat.name);
                  }}
                  title="Rename"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setCategoryToDelete(cat);
                    setShowDeleteModal(true);
                  }}
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Enter category name"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>{categoryToDelete.name}</strong>? All files under this
              category will be permanently removed.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/department-repository";
          }}
          className="w-full text-sm px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 hover:text-red-800 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
