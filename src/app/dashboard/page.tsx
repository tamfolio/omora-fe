"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import MainPage from '@/components/ui/UserDashboard/MainPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  );
}