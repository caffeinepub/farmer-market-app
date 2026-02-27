import React from 'react';
import { useNavigate } from '@tanstack/react-router';

// Cart/Checkout removed in Job Portal. Redirect to home.
export default function CartCheckout() {
  const navigate = useNavigate();
  React.useEffect(() => { navigate({ to: '/' }); }, [navigate]);
  return null;
}
