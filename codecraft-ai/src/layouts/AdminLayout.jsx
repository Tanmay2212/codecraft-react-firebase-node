// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const crumbs = pathname.split('/').filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Admin 🛠️</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block px-2 py-1 hover:bg-gray-200 rounded">User Mgmt</Link>
          <Link to="/upload" className="block px-2 py-1 hover:bg-gray-200 rounded">File Upload</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/admin">Admin</Link>
          {crumbs.map((c, i) => (
            <span key={i}>
              {' / '}
              {i === crumbs.length - 1 ? c.charAt(0).toUpperCase() + c.slice(1) : (
                <Link to={`/${crumbs.slice(0, i + 1).join('/')}`} className="hover:underline">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Link>
              )}
            </span>
          ))}
        </div>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
