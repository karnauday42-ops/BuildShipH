import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { ProtectedRoute } from './components/auth/ProtectedRoute.js';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.js';
import { LoginPage } from './pages/public/LoginPage.js';
import { RegisterPage } from './pages/public/RegisterPage.js';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.js';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage.js';
import { AboutPage } from './pages/public/AboutPage.js';
import { FoodSafetyPage } from './pages/public/FoodSafetyPage.js';

// Donor Pages
import { DonorDashboard } from './pages/donor/DonorDashboard.js';
import { DonorListingsPage } from './pages/donor/DonorListingsPage.js';
import { DonorListingNewPage } from './pages/donor/DonorListingNewPage.js';
import { DonorListingDetailPage } from './pages/donor/DonorListingDetailPage.js';
import { DonorListingEditPage } from './pages/donor/DonorListingEditPage.js';
import { DonorRequestsPage } from './pages/donor/DonorRequestsPage.js';
import { DonorImpactPage } from './pages/donor/DonorImpactPage.js';
import { DonorProfilePage } from './pages/donor/DonorProfilePage.js';

// Recipient Pages
import { RecipientDashboard } from './pages/recipient/RecipientDashboard.js';
import { BrowseFoodPage } from './pages/recipient/BrowseFoodPage.js';
import { FoodDetailPage } from './pages/recipient/FoodDetailPage.js';
import { RecipientRequestsPage } from './pages/recipient/RecipientRequestsPage.js';
import { ReceivedFoodPage } from './pages/recipient/ReceivedFoodPage.js';
import { RecipientImpactPage } from './pages/recipient/RecipientImpactPage.js';
import { RecipientProfilePage } from './pages/recipient/RecipientProfilePage.js';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.js';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage.js';
import { AdminListingsPage } from './pages/admin/AdminListingsPage.js';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.js';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

// Shared Protected & Error Pages
import { NotificationsPage } from './pages/shared/NotificationsPage.js';
import { SettingsPage } from './pages/shared/SettingsPage.js';
import { UnauthorizedPage } from './pages/shared/UnauthorizedPage.js';
import { NotFoundPage } from './pages/shared/NotFoundPage.js';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/food-safety" element={<FoodSafetyPage />} />

            {/* Protected Donor Routes */}
            <Route
              path="/donor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/listings"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/listings/new"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorListingNewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/listings/:id"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorListingDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/listings/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorListingEditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/requests"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/impact"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorImpactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor/profile"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Recipient Routes */}
            <Route
              path="/recipient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <RecipientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/available-food"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <BrowseFoodPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/available-food/:id"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <FoodDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/requests"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <RecipientRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/received-food"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <ReceivedFoodPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/impact"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <RecipientImpactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient/profile"
              element={
                <ProtectedRoute allowedRoles={['recipient', 'admin']}>
                  <RecipientProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Administrator Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/organizations"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrganizationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/listings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Protected Routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallbacks */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

