import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 px-3 text-xs font-semibold rounded-full"
      aria-label="Toggle language"
    >
      {language === 'en' ? 'தமிழ்' : 'EN'}
    </Button>
  );
}
