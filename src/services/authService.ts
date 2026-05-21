// Relative path → Vite proxy forwards to https://ala-mahlak.runasp.net in dev.
// In production build, set this to 'https://ala-mahlak.runasp.net/api'
const BASE_URL = '/api';

// ─── Request types ──────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ─── Response types ─────────────────────────────────────────────────────────

export interface TokenPayload {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
  role: string;
}

// Shared token-envelope (used by both Login & Register)
export interface AuthResponse {
  message: string;
  token: TokenPayload;
  compCode?: string;
}

// ─── Session keys ──────────────────────────────────────────────────────────

const TOKEN_KEY   = 'ala_mahlak_token';
const COMPANY_KEY = 'ala_mahlak_company';

// ─── HTTP helpers ────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // Try to pull the most useful error message from the response
    const msg = isJson
      ? body?.message || body?.title || Object.values(body?.errors ?? {}).flat().join(', ')
      : body;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return body as T;
}

function post<T>(path: string, data: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => handleResponse<T>(r));
}

function authenticatedGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  }).then(r => handleResponse<T>(r));
}

function authenticatedPost<T>(path: string, data: unknown): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  return fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  }).then(r => handleResponse<T>(r));
}

export type DriverStatus = 'active' | 'break' | 'offline';

export interface CompanyDriver {
  id: number;
  name: string;
  profilePhoto?: string;
  email: string;
  phoneNumber: string;
  compCode: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  compCode: string;
  userId: number;
  userName: string;
  userProfilePhoto?: string;
  userEmail: string;
  userPhoneNumber: string;
  approved: boolean;
  status: string;
  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

export function getJoinRequests(): Promise<JoinRequest[]> {
  return authenticatedGet<JoinRequest[]>('/companies/join-requests');
}

export function decideJoinRequest(requestId: string, decision: 'accept' | 'reject'): Promise<{ message: string }> {
  return authenticatedPost<{ message: string }>('/companies/join-requests/decision', { requestId, decision });
}

export function getCompanyDrivers(): Promise<CompanyDriver[]> {
  return authenticatedGet<CompanyDriver[]>('/companies/drivers');
}

// ─── Auth endpoints ──────────────────────────────────────────────────────────

/** POST /api/Companies/Login */
export function loginCompany(data: LoginRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/company/Login', data);
}

/** POST /api/auth/company/register */
export function registerCompany(data: RegisterRequest): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/company/register', data);
}

/** POST /api/Companies/ForgotPassword */
export function forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/Companies/ForgotPassword', data);
}

/** POST /api/Companies/VerifyOtp */
export function verifyOtp(data: VerifyOtpRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/Companies/VerifyOtp', data);
}

/** POST /api/Companies/ResetPassword */
export function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/Companies/ResetPassword', data);
}

/** POST /api/auth/logout */
export function logoutCompany(): Promise<{ message: string }> {
  return authenticatedPost<{ message: string }>('/auth/logout', {});
}

// ─── Session helpers ─────────────────────────────────────────────────────────

export function saveSession(res: AuthResponse, emailFallback?: string) {
  // Handle different response structures
  const tokenData = res.token || (res as any);
  
  if (!tokenData?.accessToken) {
    console.error('Invalid response structure:', res);
    throw new Error('Invalid login response: missing accessToken');
  }

  localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
  const stored = {
    email: emailFallback ?? '',
    role: tokenData.role || 'user',
    companyCode: res.compCode || undefined,
  };
  localStorage.setItem(COMPANY_KEY, JSON.stringify(stored));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(COMPANY_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionInfo(): { email: string; role: string; companyCode?: string } | null {
  const raw = localStorage.getItem(COMPANY_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
