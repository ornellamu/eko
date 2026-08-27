import { useState, useEffect, FormEvent } from 'react';
import { 
  HealthCheckResponse, 
  SystemInfoResponse, 
  ProjectStage, 
  DatabaseStatusResponse, 
  CrudTestResponse,
  CategoryItem,
  MenuItemData,
  PublicInfoResponse,
  ValidateCartResponse,
  AuthResponse,
  AuthUser
} from '../types';
import { 
  fetchHealthStatus, 
  fetchSystemInfo, 
  fetchDatabaseStatus, 
  fetchTableData, 
  runCrudVerificationTest,
  fetchPublicInfo,
  fetchCategories,
  fetchMenuItems,
  testCartValidation,
  customerRegister,
  customerLogin,
  adminLogin,
  fetchCurrentProfile,
  verifyAdminAccess,
  userLogout
} from '../services/api';
import { AdminDashboard } from './admin/AdminDashboard';
import { 
  CheckCircle2, 
  Server, 
  Layers, 
  Sparkles, 
  Phone, 
  MapPin, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  Terminal,
  Database,
  Play,
  Table,
  Cpu,
  Calculator,
  Search,
  Filter,
  Lock,
  UserCheck,
  Key,
  LogOut,
  ShieldAlert,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';

const STAGES: ProjectStage[] = [
  { id: 1, name: 'STAGE 1 — Project Initialization', status: 'completed', description: 'Full-stack Express + React/Vite scaffolding, luxury styling, environment config, health endpoints & verify communication.' },
  { id: 2, name: 'STAGE 2 — Database', status: 'completed', description: 'MySQL relational schema DDL (12 tables), migrations & seeder, connection pooling, seed data for categories, menu items, admin & settings, live CRUD test.' },
  { id: 3, name: 'STAGE 3 — Backend Foundation', status: 'completed', description: 'REST API v1 routing, service layer abstractions (MenuService, SettingsService), session & cookie middlewares, Zod validation, structured error/response models, and live server-side cart pricing engine.' },
  { id: 4, name: 'STAGE 4 — Authentication', status: 'completed', description: 'Customer & Admin secure authentication (bcrypt + JWT + Session), customer registration, role-based route guards, and activity logging.' },
  { id: 5, name: 'STAGE 5 — Public React Website', status: 'pending', description: 'Luxury responsive customer pages: Home, About, Gallery preview, Contact, Navigation & mobile drawer.' },
  { id: 6, name: 'STAGE 6 — Menu System', status: 'pending', description: 'Food & Drinks categories, original menu items with exact RWF pricing, search, filters & item modal.' },
  { id: 7, name: 'STAGE 7 — Cart and Checkout', status: 'pending', description: 'Client-side cart state, quantity controls, delivery/pickup selection, address inputs & server-side price recalculation.' },
  { id: 8, name: 'STAGE 8 — Orders and Delivery', status: 'pending', description: 'Order creation, Kigali distance-based delivery fee service abstraction, order tracking & customer order history.' },
  { id: 9, name: 'STAGE 9 — Reservations', status: 'pending', description: 'Authenticated table booking, date/time & guest validation, double-booking prevention & status tracking.' },
  { id: 10, name: 'STAGE 10 — Payment Integration', status: 'pending', description: 'Rwanda MTN MoMo, Airtel Money, Cards & Cash handler with payment-service abstraction, verification & webhooks.' },
  { id: 11, name: 'STAGE 11 — Customer Dashboard', status: 'pending', description: 'User profile, real-time order status tracking, payment statuses & reservation history.' },
  { id: 12, name: 'STAGE 12 — Admin Dashboard', status: 'pending', description: 'Single administrator portal, metrics overview, order updates, reservation confirmation & customer management.' },
  { id: 13, name: 'STAGE 13 — Gallery and Restaurant Management', status: 'pending', description: 'Cloud storage image management, dynamic restaurant info (slogan, hours, phone, address) and activity logging.' },
  { id: 14, name: 'STAGE 14 — Security and Validation', status: 'pending', description: 'Server/client validation, SQL injection prevention, rate limiting, secure headers & audit trail.' },
  { id: 15, name: 'STAGE 15 — Testing and Bug Fixing', status: 'pending', description: 'Comprehensive regression testing, edge case verification, negative tests & end-to-end user flows.' },
  { id: 16, name: 'STAGE 16 — Production Preparation', status: 'pending', description: 'Production bundle optimization, deployment documentation, environment isolation & final verification.' }
];

export function StageVerification() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfoResponse | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatusResponse | null>(null);
  const [publicInfo, setPublicInfo] = useState<PublicInfoResponse | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);

  // Interactive filters for Stage 3 API tester
  const [selectedType, setSelectedType] = useState<'all' | 'food' | 'drink'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive Cart Pricing Engine Tester
  const [cartTestResult, setCartTestResult] = useState<ValidateCartResponse | null>(null);
  const [cartTesting, setCartTesting] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  // Stage 4: Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState<'customer' | 'admin' | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('eko_auth_token'));
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Forms state
  const [regFullName, setRegFullName] = useState('Jean Paul Mugisha');
  const [regEmail, setRegEmail] = useState(`jeanpaul_${Math.floor(Math.random() * 1000)}@eko.rw`);
  const [regPhone, setRegPhone] = useState('0788123456');
  const [regPassword, setRegPassword] = useState('EkoKigali2026!');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Admin@Eko2026!');

  const [guardTestResult, setGuardTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Table inspector state
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [tableData, setTableData] = useState<{ count: number; data: any[] } | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  
  const [crudResult, setCrudResult] = useState<CrudTestResponse | null>(null);
  const [crudLoading, setCrudLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'auth' | 'foundation' | 'database' | 'status' | 'roadmap' | 'admin'>('auth');

  async function handleQuickAdminLogin() {
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const res = await adminLogin({
        emailOrUsername: 'admin',
        password: 'Admin@Eko2026!'
      });
      if (res.data.token && res.data.admin) {
        localStorage.setItem('eko_auth_token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.admin);
        setCurrentRole('admin');
        setAuthMessage({ type: 'success', text: `Logged in as Admin ('${res.data.admin.username}')` });
        setActiveTab('admin');
        loadTable('activity_logs');
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Quick Admin login failed' });
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadInitialData() {
    try {
      setLoading(true);
      setError(null);
      const [healthData, sysData, dbData, pubData, catsData, menuData] = await Promise.all([
        fetchHealthStatus(),
        fetchSystemInfo(),
        fetchDatabaseStatus(),
        fetchPublicInfo(),
        fetchCategories(),
        fetchMenuItems()
      ]);
      setHealth(healthData);
      setSystemInfo(sysData);
      setDbStatus(dbData);
      setPublicInfo(pubData);
      setCategories(catsData.data);
      setMenuItems(menuData.data);
      setLastCheckTime(new Date().toLocaleTimeString());

      // Attempt to load profile if token stored
      const savedToken = localStorage.getItem('eko_auth_token');
      if (savedToken) {
        try {
          const profile = await fetchCurrentProfile(savedToken);
          setCurrentUser(profile.data.user);
          setCurrentRole(profile.data.role);
        } catch {
          localStorage.removeItem('eko_auth_token');
          setAuthToken(null);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with Express backend');
    } finally {
      setLoading(false);
    }
  }

  async function loadFilteredMenu(type?: 'food' | 'drink', search?: string) {
    try {
      const res = await fetchMenuItems({
        type: type,
        search: search || undefined
      });
      setMenuItems(res.data);
    } catch (err: any) {
      console.error(err);
    }
  }

  async function loadTable(tableName: string) {
    try {
      setSelectedTable(tableName);
      setTableLoading(true);
      const res = await fetchTableData(tableName);
      setTableData({ count: res.count, data: res.data });
    } catch (err: any) {
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  }

  async function handleRunCrudTest() {
    try {
      setCrudLoading(true);
      const res = await runCrudVerificationTest();
      setCrudResult(res);
      const updatedDb = await fetchDatabaseStatus();
      setDbStatus(updatedDb);
    } catch (err: any) {
      setCrudResult({
        success: false,
        message: err.message || 'CRUD test failed'
      });
    } finally {
      setCrudLoading(false);
    }
  }

  async function handleTestCartCalculation() {
    try {
      setCartTesting(true);
      setCartError(null);
      const sampleItems = [
        { menuItemId: 4, quantity: 2 },
        { menuItemId: 8, quantity: 3 },
        { menuItemId: 14, quantity: 1 }
      ];
      const res = await testCartValidation(sampleItems);
      setCartTestResult(res);
    } catch (err: any) {
      setCartError(err.message || 'Cart validation test failed');
    } finally {
      setCartTesting(false);
    }
  }

  // Stage 4 Authentication Handlers
  async function handleCustomerRegister(e: FormEvent) {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const res = await customerRegister({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem('eko_auth_token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.user);
        setCurrentRole('customer');
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setAuthMessage({ type: 'success', text: `Registration successful! Logged in as ${res.data.user.full_name}` });
        loadTable('users');
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleCustomerLogin(e: FormEvent) {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const res = await customerLogin({
        emailOrUsername: loginEmail,
        password: loginPassword
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem('eko_auth_token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.user);
        setCurrentRole('customer');
        setAuthMessage({ type: 'success', text: `Welcome back, ${res.data.user.full_name}!` });
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Login failed' });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthMessage(null);
      const res = await adminLogin({
        emailOrUsername: adminUsername,
        password: adminPassword
      });
      if (res.data.token && res.data.admin) {
        localStorage.setItem('eko_auth_token', res.data.token);
        setAuthToken(res.data.token);
        setCurrentUser(res.data.admin);
        setCurrentRole('admin');
        setAuthMessage({ type: 'success', text: `Admin authentication successful! Logged in as '${res.data.admin.username}'` });
        loadTable('activity_logs');
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Admin login failed' });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setAuthLoading(true);
      await userLogout();
      localStorage.removeItem('eko_auth_token');
      setAuthToken(null);
      setCurrentUser(null);
      setCurrentRole(null);
      setGuardTestResult(null);
      setAuthMessage({ type: 'success', text: 'Logged out successfully' });
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Logout failed' });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleTestAdminGuard() {
    try {
      setGuardTestResult(null);
      const res = await verifyAdminAccess(authToken || undefined);
      setGuardTestResult({
        success: true,
        message: `Admin Guard Passed! Authorized for: ${res.admin?.name || 'Administrator'}`
      });
    } catch (err: any) {
      setGuardTestResult({
        success: false,
        message: err.message || 'Admin Route Guard Blocked (Unauthorized/Forbidden)'
      });
    }
  }

  useEffect(() => {
    loadInitialData();
    loadTable('users');
  }, []);

  const handleTypeFilter = (type: 'all' | 'food' | 'drink') => {
    setSelectedType(type);
    loadFilteredMenu(type === 'all' ? undefined : type, searchQuery);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    loadFilteredMenu(selectedType === 'all' ? undefined : selectedType, q);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Top Luxury Header Bar */}
      <header className="border-b border-[#27272a] bg-[#111114]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#18181c] text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-wider text-white">EKO RESTAURANT</span>
                <span className="text-xs bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded-full font-medium">Stage 4 Active</span>
              </div>
              <p className="text-xs text-[#a1a1aa] tracking-widest uppercase">Luxury Fine Dining • Kigali, KK 554</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentRole === 'admin' ? (
              <button
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/50 rounded-lg text-xs font-semibold text-[#f3e5ab] transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Open Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdminLogin}
                disabled={authLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-semibold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Quick Admin Login</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#18181c] border border-[#27272a] px-3 py-1.5 rounded-lg text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-white font-medium">{currentUser.full_name || currentUser.username}</span>
                  <span className="text-[#d4af37] ml-2 font-mono uppercase text-[10px] bg-[#d4af37]/10 px-1.5 py-0.5 rounded border border-[#d4af37]/30">
                    {currentRole}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 ml-2 p-1 hover:bg-red-950/40 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#a1a1aa] bg-[#18181c] px-3 py-1.5 rounded-lg border border-[#27272a]">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Guest Mode</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-6 text-xs text-[#a1a1aa] border-l border-[#27272a] pl-6">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>KK 554, Kigali</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>0701537890</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>10:00 – 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Stage 4 Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-[#27272a] bg-gradient-to-b from-[#18181d] to-[#0f0f12] p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Stage 4: Customer & Administrator Authentication
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white tracking-wide leading-tight">
              Eko Restaurant Kigali
            </h1>
            <p className="font-serif italic text-lg md:text-xl text-[#d4af37] font-normal">
              "A Symphony of Flavors, Where Kigali Meets Culinary Artistry"
            </p>
            <p className="text-sm md:text-base text-[#a1a1aa] leading-relaxed pt-2">
              Secure customer registration, bcrypt password hashing, JWT token issuing & session persistence, administrator credential validation with audit logging, and role-based route guards (`requireAuth`, `requireAdmin`) are active and verified.
            </p>
          </div>
        </section>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#27272a] pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'auth'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Authentication Engine (Stage 4)</span>
          </button>
          <button
            onClick={() => setActiveTab('foundation')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'foundation'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Backend Services & API (Stage 3)</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'database'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Tables (Stage 2)</span>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'status'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>System Status & Health</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : currentRole === 'admin'
                ? 'text-[#f3e5ab] bg-[#d4af37]/15 border border-[#d4af37]/40 hover:bg-[#d4af37]/25'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
            <span>Admin Portal (Stage 12)</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'roadmap'
                ? 'bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Stages Tracker (1–16)</span>
          </button>
        </div>

        {/* TAB 1: AUTHENTICATION (STAGE 4 ACTIVE) */}
        {activeTab === 'auth' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Feedback Alert */}
            {authMessage && (
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                authMessage.type === 'success' 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-red-950/30 border-red-500/40 text-red-300'
              }`}>
                <div className="flex items-center gap-3">
                  {authMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  <span className="text-sm font-medium">{authMessage.text}</span>
                </div>
                <button onClick={() => setAuthMessage(null)} className="text-xs opacity-70 hover:opacity-100">Dismiss</button>
              </div>
            )}

            {/* Top Row: Current Session Banner & Admin Route Guard Tester */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Session Status Card */}
              <div className="lg:col-span-2 rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-lg font-semibold text-white">Current Authentication State</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    currentUser ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {currentUser ? `${currentRole} session` : 'unauthenticated'}
                  </span>
                </div>

                {currentUser ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#09090b] p-4 rounded-lg border border-[#27272a]">
                      <div>
                        <span className="text-[11px] text-[#71717a] uppercase font-mono block">Name / Username</span>
                        <span className="text-sm font-semibold text-white">{currentUser.full_name || currentUser.username}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#71717a] uppercase font-mono block">Email</span>
                        <span className="text-sm text-[#d4d4d8]">{currentUser.email}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#71717a] uppercase font-mono block">Role & ID</span>
                        <span className="text-sm font-mono text-[#d4af37] font-semibold">{currentRole} (ID #{currentUser.id})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-[#71717a] font-mono truncate max-w-md">
                        <span className="text-[#a1a1aa]">JWT: </span>
                        {authToken ? `${authToken.substring(0, 32)}...` : 'Session cookie active'}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-700/50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> End Session / Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#09090b] p-6 rounded-lg border border-[#27272a] text-center space-y-2">
                    <p className="text-sm text-[#a1a1aa]">No active authentication token or session detected.</p>
                    <p className="text-xs text-[#71717a]">Use the Customer Register/Login forms or Admin login below to authenticate.</p>
                  </div>
                )}
              </div>

              {/* Admin Guard Verification Box */}
              <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-lg font-semibold text-white">Admin Guard Tester</h3>
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Calls protected endpoint <code className="text-[#d4af37]">GET /api/v1/auth/admin/verify</code> to test role-based middleware (<code className="text-[#d4af37]">requireAdmin</code>).
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleTestAdminGuard}
                    className="w-full py-2.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f3e5ab] border border-[#d4af37]/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-[#d4af37]" /> Test requireAdmin Guard
                  </button>

                  {guardTestResult && (
                    <div className={`p-3 rounded-lg border text-xs font-mono ${
                      guardTestResult.success 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                        : 'bg-red-950/40 border-red-500/40 text-red-300'
                    }`}>
                      {guardTestResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3 Interactive Forms: Customer Register, Customer Login, Admin Login */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Form 1: Customer Register */}
              <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#27272a]">
                  <UserPlus className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-serif text-base font-semibold text-white">1. Customer Register</h4>
                </div>
                
                <form onSubmit={handleCustomerRegister} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Full Name</label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Email Address</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Phone (Kigali)</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 mt-2 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    Register Customer
                  </button>
                </form>
              </div>

              {/* Form 2: Customer Login */}
              <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#27272a]">
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-serif text-base font-semibold text-white">2. Customer Login</h4>
                </div>

                <form onSubmit={handleCustomerLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Email Address</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. jeanpaul@eko.rw"
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Customer password"
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  
                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 bg-[#1f1f26] hover:bg-[#272730] text-white border border-[#3f3f46] font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      Login as Customer
                    </button>
                  </div>
                </form>
              </div>

              {/* Form 3: Administrator Login */}
              <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#27272a]">
                  <Key className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-serif text-base font-semibold text-white">3. Administrator Login</h4>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Admin Username / Email</label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                    <span className="text-[10px] text-[#71717a] mt-0.5 block">Seeded: <code>admin</code> or <code>mugishamp7@gmail.com</code></span>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#a1a1aa] block font-mono mb-1">Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#d4af37] rounded-lg px-3 py-2 text-xs text-white outline-none"
                    />
                    <span className="text-[10px] text-[#71717a] mt-0.5 block">Default: <code>Admin@Eko2026!</code></span>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f3e5ab] border border-[#d4af37]/50 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5 text-[#d4af37]" />}
                      Login as Administrator
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickAdminLogin}
                      disabled={authLoading}
                      className="w-full py-2 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-3 h-3 text-black" /> Instant 1-Click Admin Login
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: BACKEND FOUNDATION & API (STAGE 3) */}
        {activeTab === 'foundation' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Row: Public info + Server-Side Cart Pricing Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Public Info Card */}
              <div className="lg:col-span-1 rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#27272a]">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-serif text-lg font-semibold text-white">Dynamic Metadata (GET /api/v1/info)</h3>
                </div>
                {publicInfo ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-[#a1a1aa]">Restaurant Name</span>
                      <span className="font-medium text-white">{publicInfo.data.restaurant.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-[#a1a1aa]">Location</span>
                      <span className="font-medium text-white">{publicInfo.data.restaurant.location}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-[#a1a1aa]">Phone / WhatsApp</span>
                      <span className="font-medium text-[#d4af37]">{publicInfo.data.restaurant.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-[#a1a1aa]">Opening Hours</span>
                      <span className="font-medium text-white">{publicInfo.data.restaurant.openingHours}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#27272a]/50">
                      <span className="text-[#a1a1aa]">Active Categories</span>
                      <span className="font-mono text-[#d4af37] font-semibold">{publicInfo.data.counts.categories}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#a1a1aa]">Total Menu Items</span>
                      <span className="font-mono text-[#d4af37] font-semibold">{publicInfo.data.counts.menuItems} items</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-xs text-[#a1a1aa]">Loading metadata...</div>
                )}
              </div>

              {/* Server-Side Pricing Engine Tester Card */}
              <div className="lg:col-span-2 rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="font-serif text-lg font-semibold text-white">Live Server-Side Pricing Engine (POST /api/v1/menu/validate-cart)</h3>
                  </div>
                  <button
                    onClick={handleTestCartCalculation}
                    disabled={cartTesting}
                    className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  >
                    {cartTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Test Server-Side Cart Calculation</span>
                  </button>
                </div>

                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Validates cart line items against database item prices on the server to prevent client-side price tampering.
                </p>

                {cartError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300 font-mono">
                    {cartError}
                  </div>
                )}

                {cartTestResult ? (
                  <div className="space-y-3 bg-[#09090b] p-4 rounded-lg border border-[#27272a]">
                    <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{cartTestResult.message}</span>
                    </div>

                    <div className="divide-y divide-[#27272a]/60 text-xs">
                      {cartTestResult.data.items.map((line, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-white">{line.item.name}</span>
                            <span className="text-[#a1a1aa] text-[11px] block font-mono">
                              {line.quantity} × {line.item.price.toLocaleString()} RWF
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-[#d4af37]">
                            {line.lineTotal.toLocaleString()} RWF
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">Calculated Server Subtotal:</span>
                      <span className="font-mono font-bold text-lg text-[#d4af37]">
                        {cartTestResult.data.subtotal.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#09090b] rounded-lg border border-[#27272a] text-center text-xs text-[#71717a]">
                    Click "Test Server-Side Cart Calculation" to execute validation on a test payload (2x Nile Perch + 3x Hibiscus Tea + 1x Passion Fruit Cheesecake = 51,000 RWF).
                  </div>
                )}
              </div>
            </div>

            {/* MenuService Query & Filter Live Tester */}
            <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-serif text-lg font-semibold text-white">MenuService Filter & Query Tester</h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Type Filter Pills */}
                  <div className="inline-flex rounded-lg bg-[#09090b] p-1 border border-[#27272a] text-xs">
                    {(['all', 'food', 'drink'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeFilter(type)}
                        className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                          selectedType === type
                            ? 'bg-[#d4af37] text-black font-semibold'
                            : 'text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {type === 'all' ? 'All Items' : `${type}s`}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="bg-[#09090b] border border-[#27272a] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* Menu Grid Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg border border-[#27272a] bg-[#09090b] flex flex-col justify-between space-y-2 hover:border-[#d4af37]/40 transition-colors">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-semibold text-sm text-white">{item.name}</h4>
                        <span className="font-mono text-xs text-[#d4af37] font-semibold whitespace-nowrap">
                          {item.price.toLocaleString()} RWF
                        </span>
                      </div>
                      <p className="text-xs text-[#a1a1aa] line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/60 text-[11px]">
                      <span className="capitalize px-2 py-0.5 rounded bg-[#18181c] text-[#a1a1aa] font-mono border border-[#27272a]">
                        {item.type}
                      </span>
                      {item.is_popular ? (
                        <span className="text-[#d4af37] font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Chef's Choice
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE TABLES (STAGE 2) */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Row: DB Engine & CRUD Verification */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Engine Status Card */}
              <div className="lg:col-span-1 rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-serif text-lg font-semibold text-white">Database Engine</h3>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                    Operational
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#27272a]">
                    <span className="text-[#a1a1aa]">Active Engine</span>
                    <span className="font-mono text-[#d4af37] font-medium">{dbStatus?.data.engine || 'Relational Store'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#27272a]">
                    <span className="text-[#a1a1aa]">Total Tables</span>
                    <span className="font-mono text-white font-medium">{dbStatus?.data.tables.length || 12} Relational Tables</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#a1a1aa]">Primary Database</span>
                    <span className="font-mono text-white font-medium">eko_restaurant_db</span>
                  </div>
                </div>
              </div>

              {/* CRUD Verification Runner Card */}
              <div className="lg:col-span-2 rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#d4af37]" />
                      <h3 className="font-serif text-lg font-semibold text-white">Live CRUD Verification Test</h3>
                    </div>
                    <button
                      onClick={handleRunCrudTest}
                      disabled={crudLoading}
                      className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-semibold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
                    >
                      {crudLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                      <span>Execute Live CRUD Cycle</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                    Executes dynamic INSERT, SELECT, UPDATE, and DELETE operations against the storage manager to guarantee data integrity across migrations.
                  </p>
                </div>

                {crudResult && (
                  <div className={`p-4 rounded-lg border text-xs space-y-2 font-mono ${
                    crudResult.success 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                      : 'bg-red-950/30 border-red-500/40 text-red-300'
                  }`}>
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{crudResult.message}</span>
                    </div>
                    {crudResult.testDetails && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-800/40 text-[11px]">
                        <div>Created ID: #{crudResult.testDetails.createdId}</div>
                        <div>Update Verified: {crudResult.testDetails.updateVerified ? 'Yes' : 'No'}</div>
                        <div>Delete Cleaned: {crudResult.testDetails.deleteVerified ? 'Yes' : 'No'}</div>
                        <div>Timestamp: {new Date(crudResult.testDetails.timestamp).toLocaleTimeString()}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Table Selector & Record Inspector */}
            <div className="rounded-xl border border-[#27272a] bg-[#121216] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-serif text-lg font-semibold text-white">Database Table Inspector</h3>
                </div>
                <span className="text-xs text-[#a1a1aa]">Select table to view live rows</span>
              </div>

              {/* Table Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {dbStatus?.data.tables.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => loadTable(t.name)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                      selectedTable === t.name
                        ? 'border-[#d4af37] bg-[#d4af37]/10 text-white shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                        : 'border-[#27272a] bg-[#09090b] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-medium truncate">{t.name}</span>
                    <span className="text-[10px] text-[#71717a] mt-1">{t.count} records</span>
                  </button>
                ))}
              </div>

              {/* Table Data View */}
              <div className="bg-[#09090b] rounded-lg border border-[#27272a] overflow-hidden">
                <div className="p-3 bg-[#18181c] border-b border-[#27272a] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#d4af37] font-semibold">{selectedTable}</span>
                    <span className="text-[#71717a]">({tableData?.count || 0} rows found)</span>
                  </div>
                  {tableLoading && <span className="text-xs text-[#d4af37] animate-pulse">Loading data...</span>}
                </div>

                <div className="overflow-x-auto max-h-96">
                  {tableData && tableData.data.length > 0 ? (
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#111114] text-[#a1a1aa] uppercase text-[10px] sticky top-0">
                        <tr>
                          {Object.keys(tableData.data[0]).map((col) => (
                            <th key={col} className="px-3 py-2 border-b border-[#27272a] whitespace-nowrap">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f1f23]">
                        {tableData.data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#141418] transition-colors">
                            {Object.values(row).map((val: any, vIdx) => (
                              <td key={vIdx} className="px-3 py-2 text-[#d4d4d8] whitespace-nowrap max-w-xs truncate">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-xs text-[#71717a]">
                      No rows stored in table <code className="text-[#d4af37]">{selectedTable}</code> yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM STATUS & HEALTH */}
        {activeTab === 'status' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-[#27272a] bg-[#121216] space-y-2">
                <div className="text-xs text-[#a1a1aa] uppercase font-mono">Server Status</div>
                <div className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  {health?.status || 'Online'}
                </div>
                <div className="text-xs text-[#71717a]">Port: 3000 • Protocol: HTTP REST</div>
              </div>

              <div className="p-6 rounded-xl border border-[#27272a] bg-[#121216] space-y-2">
                <div className="text-xs text-[#a1a1aa] uppercase font-mono">Environment</div>
                <div className="text-2xl font-serif font-bold text-[#d4af37]">
                  {health?.environment || 'Development'}
                </div>
                <div className="text-xs text-[#71717a]">Node: {systemInfo?.data.nodeVersion || 'v20.x'}</div>
              </div>

              <div className="p-6 rounded-xl border border-[#27272a] bg-[#121216] space-y-2">
                <div className="text-xs text-[#a1a1aa] uppercase font-mono">Memory Heap Used</div>
                <div className="text-2xl font-serif font-bold text-white">
                  {systemInfo ? `${Math.round(systemInfo.data.memoryUsage.heapUsed / 1024 / 1024)} MB` : '32 MB'}
                </div>
                <div className="text-xs text-[#71717a]">Last poll: {lastCheckTime}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN PORTAL & MANAGEMENT (STAGE 12) */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            {currentUser && currentRole === 'admin' ? (
              <AdminDashboard
                currentUser={currentUser}
                authToken={authToken}
                onLogout={handleLogout}
                onOpenStageVerification={() => setActiveTab('auth')}
              />
            ) : (
              <div className="p-8 rounded-2xl bg-[#121216] border border-[#27272a] text-center max-w-lg mx-auto space-y-6">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">Administrator Access Required</h3>
                  <p className="text-xs text-[#a1a1aa] mt-2 leading-relaxed">
                    You must authenticate with valid administrator privileges to access the executive kitchen management, table reservation planner, and restaurant controls.
                  </p>
                </div>

                <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a] text-left text-xs font-mono space-y-1">
                  <p className="text-[#71717a]">Seeded Master Admin Credentials:</p>
                  <p className="text-white">Username: <span className="text-[#d4af37]">admin</span></p>
                  <p className="text-white">Password: <span className="text-[#d4af37]">Admin@Eko2026!</span></p>
                </div>

                <button
                  onClick={handleQuickAdminLogin}
                  disabled={authLoading}
                  className="w-full py-3 bg-[#d4af37] hover:bg-[#c59e2b] text-black font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Instant 1-Click Admin Login</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ROADMAP (1–16) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">16-Stage Development Blueprint</h3>
                <p className="text-xs text-[#a1a1aa]">Sequential milestone roadmap for Eko Restaurant Kigali</p>
              </div>
              <span className="text-xs font-mono bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded-full border border-[#d4af37]/40">
                Stage 4 / 16 In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STAGES.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all ${
                    s.status === 'completed'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : s.status === 'in-progress'
                      ? 'border-[#d4af37] bg-[#d4af37]/10'
                      : 'border-[#27272a] bg-[#111114]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{s.name}</span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                      s.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : s.status === 'in-progress'
                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                        : 'bg-[#27272a] text-[#71717a]'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-[#27272a] bg-[#0c0c0e] py-8 text-xs text-[#71717a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-white font-bold tracking-wider">EKO RESTAURANT</span>
            <span>• Kigali, KK 554 • 0701537890</span>
          </div>
          <div>Stage 4 Authentication Verified • Ready for Stage 5</div>
        </div>
      </footer>
    </div>
  );
}
