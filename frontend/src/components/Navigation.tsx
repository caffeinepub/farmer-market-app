import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Briefcase, ChevronDown, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../hooks/useLanguage';

export default function Navigation() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const getDashboardPath = (): '/' | '/seeker' | '/employer' | '/admin' => {
    if (!userProfile) return '/';
    if (userProfile.role === 'admin') return '/admin';
    if (userProfile.role === 'employer') return '/employer';
    return '/seeker';
  };

  const navLinks: { to: '/' | '/jobs' | '/about'; label: string }[] = [
    { to: '/', label: t('home') },
    { to: '/jobs', label: t('jobs') },
    { to: '/about', label: t('about') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <img
            src="/assets/generated/job-portal-logo.dim_128x128.png"
            alt="AI Job Portal"
            className="h-8 w-8 rounded-lg"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-portal-700 dark:text-portal-300">AI</span>
          <span className="text-teal-600 dark:text-teal-400">JobPortal</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors [&.active]:text-portal-700 [&.active]:dark:text-portal-300 [&.active]:font-semibold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-3 rounded-full">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-portal-600 text-white text-xs font-bold">
                      {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {userProfile?.name || 'User'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate({ to: getDashboardPath() })}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t('dashboard')}
                </DropdownMenuItem>
                {userProfile?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                    <Shield className="h-4 w-4 mr-2" />
                    {t('adminPanel')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="sm"
              className="bg-portal-600 hover:bg-portal-700 text-white rounded-full px-4"
            >
              {isLoggingIn ? t('loading') : t('login')}
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-2 font-display font-bold text-lg mb-2">
                  <Briefcase className="h-5 w-5 text-teal-600" />
                  <span>AI JobPortal</span>
                </div>
                {navLinks.map(link => (
                  <SheetClose asChild key={link.to}>
                    <Link
                      to={link.to}
                      className="text-base font-medium py-2 border-b border-border text-foreground hover:text-portal-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                {isAuthenticated && (
                  <SheetClose asChild>
                    <Link
                      to={getDashboardPath()}
                      className="text-base font-medium py-2 border-b border-border text-foreground hover:text-portal-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t('dashboard')}
                    </Link>
                  </SheetClose>
                )}
                {!isAuthenticated && (
                  <Button
                    onClick={() => { login(); setMobileOpen(false); }}
                    className="bg-portal-600 hover:bg-portal-700 text-white mt-2"
                  >
                    {t('login')}
                  </Button>
                )}
                {isAuthenticated && (
                  <Button variant="outline" onClick={handleLogout} className="mt-2">
                    {t('logout')}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
