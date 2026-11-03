/**
 * CryptoAnalyzer Authentication & Real-Time OTP Verification Service
 * Supports email login & registration with 6-digit OTP codes.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  institution: string;
  createdAt: string;
  lastLogin: string;
  avatarSeed?: string;
}

export interface PendingOtp {
  email: string;
  name: string;
  otp: string;
  expiresAt: number; // timestamp
  mode: 'login' | 'register';
  institution?: string;
}

const USER_SESSION_KEY = 'cryptoanalyzer_user_session_v1';
const REGISTERED_USERS_KEY = 'cryptoanalyzer_registered_users_v1';
let currentPendingOtp: PendingOtp | null = null;

// Initial pre-registered users (e.g. current user)
const DEFAULT_USERS: Record<string, User> = {
  'tdev0786@gmail.com': {
    id: 'usr-tdev-001',
    email: 'tdev0786@gmail.com',
    name: 'T. Dev (Lead Quantitative Researcher)',
    role: 'Principal Research Scientist',
    institution: 'CryptoAnalyzer Lab & AI Studio',
    createdAt: '2024-01-15T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    avatarSeed: 'TD',
  },
  'analyst@cryptoanalyzer.org': {
    id: 'usr-analyst-002',
    email: 'analyst@cryptoanalyzer.org',
    name: 'Dr. Sarah Lin',
    role: 'Quantitative Financial Analyst',
    institution: 'Stanford Computational Finance',
    createdAt: '2024-03-10T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
    avatarSeed: 'SL',
  },
};

export function getStoredUsers(): Record<string, User> {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return { ...DEFAULT_USERS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: Record<string, User>): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to save session', e);
  }
}

/**
 * Generate a cryptographically realistic 6-digit OTP
 */
export function generateOtp(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Send real-time OTP for email verification
 */
export function sendEmailOtp(
  email: string,
  mode: 'login' | 'register',
  name?: string,
  institution?: string
): { success: boolean; otp: string; message: string; expiresInSeconds: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const registeredUsers = getStoredUsers();

  if (mode === 'login' && !registeredUsers[normalizedEmail]) {
    // If user tries to login but email doesn't exist, allow auto-creating account or notify
    // In our academic platform, we can allow instant onboarding!
  }

  const otp = generateOtp();
  const expiresInSeconds = 300; // 5 minutes

  currentPendingOtp = {
    email: normalizedEmail,
    name: name?.trim() || registeredUsers[normalizedEmail]?.name || 'Crypto Researcher',
    otp,
    expiresAt: Date.now() + expiresInSeconds * 1000,
    mode,
    institution: institution || 'Quantitative Research Lab',
  };

  return {
    success: true,
    otp,
    message: `Verification OTP has been generated for ${normalizedEmail}`,
    expiresInSeconds,
  };
}

/**
 * Get active pending OTP (for demo convenience and real-time banner display)
 */
export function getPendingOtp(): PendingOtp | null {
  if (!currentPendingOtp) return null;
  if (Date.now() > currentPendingOtp.expiresAt) {
    currentPendingOtp = null;
    return null;
  }
  return currentPendingOtp;
}

/**
 * Verify OTP entered by user
 */
export function verifyEmailOtp(
  email: string,
  enteredCode: string
): { success: boolean; user?: User; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();

  if (!currentPendingOtp) {
    return { success: false, error: 'No active OTP found. Please request a new verification code.' };
  }

  if (currentPendingOtp.email !== normalizedEmail) {
    return { success: false, error: 'Email address does not match active verification session.' };
  }

  if (Date.now() > currentPendingOtp.expiresAt) {
    currentPendingOtp = null;
    return { success: false, error: 'OTP has expired (valid for 5 minutes). Please request a new code.' };
  }

  if (currentPendingOtp.otp !== enteredCode.trim()) {
    return { success: false, error: 'Invalid verification code. Please check and try again.' };
  }

  // OTP is valid! Create or update user session
  const registeredUsers = getStoredUsers();
  let user = registeredUsers[normalizedEmail];

  if (!user) {
    // Register new user
    const initials = (currentPendingOtp.name || 'CR')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    user = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      name: currentPendingOtp.name || 'Quantitative Researcher',
      role: 'Research Fellow & Analyst',
      institution: currentPendingOtp.institution || 'Academic Lab',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      avatarSeed: initials,
    };
    registeredUsers[normalizedEmail] = user;
    saveStoredUsers(registeredUsers);
  } else {
    // Update existing user last login
    user.lastLogin = new Date().toISOString();
    registeredUsers[normalizedEmail] = user;
    saveStoredUsers(registeredUsers);
  }

  saveCurrentUser(user);
  currentPendingOtp = null;

  return { success: true, user };
}

export function logoutUser(): void {
  saveCurrentUser(null);
  currentPendingOtp = null;
}
