import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

// This page is replaced by the Job Portal. Redirect to home.
export default function FarmerDashboard() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate({ to: '/' }); }, [navigate]);
  return null;
}
