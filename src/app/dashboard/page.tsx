"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import MainPage from '@/components/ui/user-dashboard/MainPage';

export default function Page() {
  return (
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  );
}