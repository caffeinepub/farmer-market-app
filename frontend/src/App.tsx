import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Navigation from './components/Navigation';
import RoleSelectionModal from './components/RoleSelectionModal';
import CareerChatbot from './components/CareerChatbot';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import About from './pages/About';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminPanel from './pages/AdminPanel';
import AccessDenied from './pages/AccessDenied';

// ─── Root Layout ──────────────────────────────────────────────────────────────

function RootLayout() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showRoleModal =
    isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1">
        {isInitializing ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-portal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading AI Job Portal...</p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>

      <footer className="border-t bg-card py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">AI JobPortal</span>
              <span>— Connecting Talent with Opportunity</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} AI JobPortal. Built with{' '}
              <span className="text-red-500">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'aijobportal'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-portal-600 hover:underline font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {showRoleModal && <RoleSelectionModal open={showRoleModal} />}

      <CareerChatbot />
    </div>
  );
}

// ─── Route Definitions ────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: JobListings,
});

const jobDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: JobDetails,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const seekerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seeker',
  component: JobSeekerDashboard,
});

const employerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer',
  component: EmployerDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDenied,
});

// ─── Router ───────────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  jobsRoute,
  jobDetailsRoute,
  aboutRoute,
  seekerRoute,
  employerRoute,
  adminRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
