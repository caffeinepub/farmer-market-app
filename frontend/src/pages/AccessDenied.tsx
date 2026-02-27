import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShieldX, Home, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { t } = useLanguage();

  const getDashboardPath = (): '/' | '/seeker' | '/employer' | '/admin' => {
    if (!userProfile) return '/';
    if (userProfile.role === 'admin') return '/admin';
    if (userProfile.role === 'employer') return '/employer';
    return '/seeker';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please navigate to your appropriate dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            {t('home')}
          </Button>
          {userProfile && (
            <Button
              onClick={() => navigate({ to: getDashboardPath() })}
              className="bg-portal-600 hover:bg-portal-700 text-white"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {t('dashboard')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
