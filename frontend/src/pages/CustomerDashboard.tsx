import React from 'react';
import { useNavigate } from '@tanstack/react-router';

// This page is replaced by the Job Portal. Redirect to home.
export default function CustomerDashboard() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate({ to: '/' }); }, [navigate]);
  return null;
}
