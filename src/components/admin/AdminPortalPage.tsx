import React from 'react';
import { AuthUser } from '../../types';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalPageProps {
  currentUser: AuthUser | null;
  authToken: string | null;
  onAdminLoginSuccess?: (admin: AuthUser, token: string) => void;
  onLogout: () => void;
  onNavigateToPublic: () => void;
  onOpenStageVerification?: () => void;
}

const defaultAdminUser: AuthUser = {
  id: 1,
  email: 'admin@ecco-restaurant.rw',
  full_name: 'ECCO General Management',
  role: 'admin',
  phone: '0701537890'
};

export function AdminPortalPage({
  currentUser,
  authToken,
  onLogout,
  onNavigateToPublic,
  onOpenStageVerification
}: AdminPortalPageProps) {
  // Direct open admin mode: No login page, no password requirement
  const effectiveAdminUser = (currentUser && (currentUser.role === 'admin' || (currentUser as any).role === 'superadmin'))
    ? currentUser
    : defaultAdminUser;
  
  const effectiveAuthToken = authToken || 'admin_direct_access';

  return (
    <AdminDashboard
      currentUser={effectiveAdminUser}
      authToken={effectiveAuthToken}
      onLogout={onLogout}
      onNavigateToPublic={onNavigateToPublic}
      onOpenStageVerification={onOpenStageVerification}
    />
  );
}
