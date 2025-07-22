import { useEffect, useState } from "react";
import axios from "axios";

interface FileEntry {
  _id: string;
  title: string;
  link: string;
  source: string;
  brand: string;
  remarks: string;
  isFile: boolean;
}

interface Props {
  categoryId: string | null;
}

const FileTable = ({ categoryId }: Props) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editFile, setEditFile] = useState<FileEntry | null>(null);
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null);

  const API = process.env.REACT_APP_API_BASE_URL;

  const fetchFiles = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/files?categoryId=${categoryId}`);
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [categoryId]);

  const handleUpdate = async () => {
    if (!editFile) return;
    try {
      await axios.put(`${API}/files/${editFile._id}`, editFile);
      setEditFile(null);
      fetchFiles();
    } catch (err) {
      console.error("❌ Error updating file:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteFileId) return;
    try {
      await axios.delete(`${API}/files/${deleteFileId}`);
      setDeleteFileId(null);
      fetchFiles();
    } catch (err) {
      console.error("❌ Error deleting file:", err);
    }
  };

  return (
    <div className="w-full mt-4">
      <p className="text-xs text-gray-400 mb-2">Category ID: {categoryId}</p>

      {loading ? (
        <p className="text-gray-500 italic">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500 italic">No files found in this category.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">File</th>
                <th className="px-4 py-2 text-left">Link</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Brand</th>
                <th className="px-4 py-2 text-left">Remarks</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {file.title}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={file.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                    >
                      {file.isFile ? "Download" : "Open Link"}
                    </a>
                  </td>
                  <td className="px-4 py-2">{file.source || "-"}</td>
                  <td className="px-4 py-2">{file.brand || "-"}</td>
                  <td className="px-4 py-2">{file.remarks || "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => setEditFile(file)}
                      className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteFileId(file._id)}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editFile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Edit File</h2>

            <input
              type="text"
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Title"
              value={editFile.title}
              onChange={(e) =>
                setEditFile({ ...editFile, title: e.target.value })
              }
            />

            <input
              type="text"
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Link"
              value={editFile.link}
              onChange={(e) =>
                setEditFile({ ...editFile, link: e.target.value })
              }
            />

            <select
              className="w-full mb-2 px-3 py-2 border rounded"
              value={editFile.isFile ? "file" : "link"}
              onChange={(e) =>
                setEditFile({ ...editFile, isFile: e.target.value === "file" })
              }
            >
              <option value="link">Open Link</option>
              <option value="file">Download (File)</option>
            </select>

            <input
              type="text"
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Source"
              value={editFile.source}
              onChange={(e) =>
                setEditFile({ ...editFile, source: e.target.value })
              }
            />

            <input
              type="text"
              className="w-full mb-2 px-3 py-2 border rounded"
              placeholder="Brand"
              value={editFile.brand}
              onChange={(e) =>
                setEditFile({ ...editFile, brand: e.target.value })
              }
            />

            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border rounded"
              placeholder="Remarks"
              value={editFile.remarks}
              onChange={(e) =>
                setEditFile({ ...editFile, remarks: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditFile(null)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteFileId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete this file?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteFileId(null)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTable;
