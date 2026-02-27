import React from 'react';

// Stub — Review/useAddReview removed from backend. This file is kept to avoid import errors.
interface ReviewFormProps {
  farmerId: unknown;
  farmerName: string;
  open: boolean;
  onClose: () => void;
}
export default function ReviewForm({ onClose }: ReviewFormProps) {
  return null;
}
