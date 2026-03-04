import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadsProvider } from './context/LeadsContext';
import QuoteModal from './components/QuoteModal';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import LeadsPage from './pages/admin/LeadsPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import DocumentsPage from './pages/admin/DocumentsPage';
import KanbanPage from './pages/admin/KanbanPage';

export default function App() {
  return (
    <LeadsProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Frontend */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="kanban" element={<KanbanPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
        </Routes>

        {/* Quote Modal rendered globally so it's accessible from any page */}
        <QuoteModal />
      </BrowserRouter>
    </LeadsProvider>
  );
}
