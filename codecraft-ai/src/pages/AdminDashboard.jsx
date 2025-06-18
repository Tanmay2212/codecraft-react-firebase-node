import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const ROWS_PER_PAGE = 8;

const AdminDashboard = () => {
  const [docs, setDocs] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const fetchAll = async () => {
    const [docsSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, "company_docs")),
      getDocs(collection(db, "users")),
    ]);
    setDocs(docsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setUsers(usersSnap.docs.map((u) => ({ id: u.id, ...u.data() })));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteFile = async (id) => {
    await deleteDoc(doc(db, "company_docs", id));
    fetchAll();
  };

  const handleUpdate = async (uid, field, value) => {
    await setDoc(doc(db, "users", uid), { [field]: value }, { merge: true });
    fetchAll();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pagedUsers = filteredUsers.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">🛠 Admin Dashboard</h1>
        <button
          onClick={() => {
            signOut(auth);
            window.location.href = "/";
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Search Users */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          className="p-2 border rounded w-full max-w-md"
        />
      </div>

      {/* User Management Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u.id} className="border-b hover:bg-blue-50 text-sm">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleUpdate(u.id, "role", e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="employee">Employee</option>
                    <option value="intern">Intern</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 space-x-4">
                  <label className="font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={u.canUpload || false}
                      onChange={(e) =>
                        handleUpdate(u.id, "canUpload", e.target.checked)
                      }
                      className="mr-1"
                    />
                    Upload
                  </label>
                  <label className="font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={u.canViewDashboard || false}
                      onChange={(e) =>
                        handleUpdate(u.id, "canViewDashboard", e.target.checked)
                      }
                      className="mr-1"
                    />
                    View
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center my-4 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span>
          Page {page + 1} of {Math.ceil(filteredUsers.length / ROWS_PER_PAGE)}
        </span>
        <button
          onClick={() =>
            setPage((p) =>
              Math.min(p + 1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE) - 1)
            )
          }
          disabled={(page + 1) * ROWS_PER_PAGE >= filteredUsers.length}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      {/* Uploaded Files */}
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-blue-700">
        📁 Uploaded Documents
      </h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-blue-100 text-sm">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Category</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} className="border-b hover:bg-blue-50 text-sm">
                <td className="p-3">{d.fileName}</td>
                <td className="p-3 capitalize">{d.department}</td>
                <td className="p-3 capitalize">{d.role}</td>
                <td className="p-3 capitalize">{d.category}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteFile(d.id)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
