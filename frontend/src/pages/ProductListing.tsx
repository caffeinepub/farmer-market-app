import React from 'react';
import { useNavigate } from '@tanstack/react-router';

// This page is replaced by the Job Portal. Redirect to /jobs.
export default function ProductListing() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate({ to: '/jobs' }); }, [navigate]);
  return null;
}
