export type User = { id: string; name: string; email: string };
type StoredUser = User & { password: string; createdAt: string };
type Session = { userId: string; email: string; remember: boolean; expiresAt: number };

const K_USER = "safeguard:user";
const K_USERS = "safeguard:users";
const K_SESSION = "safeguard:session";
const K_RESET_TOKENS = "safeguard:resetTokens";

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REMEMBER_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

const isClient = () => typeof window !== "undefined";

// UUID generator with fallback
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simple password hashing (for client-side only - in production use bcrypt on server)
function hashPassword(password: string): string {
  // Simple hash for demo - in production, use proper server-side hashing
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Session management
function createSession(userId: string, email: string, remember: boolean): void {
  if (!isClient()) return;
  
  const duration = remember ? REMEMBER_DURATION : SESSION_DURATION;
  const session: Session = {
    userId,
    email,
    remember,
    expiresAt: Date.now() + duration
  };
  
  localStorage.setItem(K_SESSION, JSON.stringify(session));
}

function getSession(): Session | null {
  if (!isClient()) return null;
  
  try {
    const sessionStr = localStorage.getItem(K_SESSION);
    if (!sessionStr) return null;
    
    const session: Session = JSON.parse(sessionStr);
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    // Auto-extend session if remember is true
    if (session.remember && session.expiresAt - Date.now() < REMEMBER_DURATION / 2) {
      createSession(session.userId, session.email, true);
    }
    
    return session;
  } catch {
    return null;
  }
}

function clearSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(K_SESSION);
  localStorage.removeItem(K_USER);
}

export function currentUser(): User | null {
  if (!isClient()) return null;
  
  // Check if there's a valid session
  const session = getSession();
  if (!session) {
    clearSession();
    return null;
  }
  
  // Try to get user from cache
  try {
    const userStr = localStorage.getItem(K_USER);
    if (userStr) {
      const user: User = JSON.parse(userStr);
      if (user.id === session.userId) {
        return user;
      }
    }
  } catch {}
  
  // Fetch user from database
  const users = getLocalUsers();
  const user = users.find(u => u.id === session.userId);
  
  if (user) {
    const userData: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(K_USER, JSON.stringify(userData));
    return userData;
  }
  
  clearSession();
  return null;
}

export function isAuthenticated(): boolean {
  return currentUser() !== null;
}

// LocalStorage fallback functions
function getLocalUsers(): StoredUser[] {
  if (!isClient()) return [];
  try { return JSON.parse(localStorage.getItem(K_USERS) || "[]"); } catch { return []; }
}

function saveLocalUsers(users: StoredUser[]) {
  if (!isClient()) return;
  localStorage.setItem(K_USERS, JSON.stringify(users));
}

export async function register(name: string, email: string, password: string, remember = true): Promise<{ ok: boolean; error?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  try {
    const emailLower = email.trim().toLowerCase();
    
    // Validate inputs
    if (!name || name.length < 2) {
      return { ok: false, error: "Name must be at least 2 characters" };
    }
    
    if (!email || !email.includes('@')) {
      return { ok: false, error: "Please enter a valid email" };
    }
    
    if (!password || password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters" };
    }
    
    const users = getLocalUsers();
    if (users.some((u) => u.email === emailLower)) {
      return { ok: false, error: "Email already registered" };
    }
    
    const newUser: StoredUser = {
      id: generateUUID(),
      name: name.trim(),
      email: emailLower,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveLocalUsers(users);
    
    const userData: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(K_USER, JSON.stringify(userData));
    
    // Create session
    createSession(newUser.id, newUser.email, remember);
    
    return { ok: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { ok: false, error: "Registration failed. Please try again." };
  }
}

export async function login(email: string, password: string, remember = false): Promise<{ ok: boolean; error?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  try {
    const emailLower = email.trim().toLowerCase();
    
    if (!email || !password) {
      return { ok: false, error: "Please enter email and password" };
    }
    
    const users = getLocalUsers();
    const hashedPassword = hashPassword(password);
    const user = users.find((u) => u.email === emailLower && u.password === hashedPassword);
    
    if (!user) {
      return { ok: false, error: "Invalid email or password" };
    }
    
    const userData: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(K_USER, JSON.stringify(userData));
    
    // Create session
    createSession(user.id, user.email, remember);
    
    return { ok: true };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, error: "Login failed. Please try again." };
  }
}

export function logout() {
  if (!isClient()) return;
  clearSession();
}

// Check if user session is still valid
export function checkSession(): boolean {
  return getSession() !== null;
}

// Forgot Password Functions
export async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string; token?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  const emailLower = email.trim().toLowerCase();
  
  // Check if user exists (in localStorage for now)
  const users = getLocalUsers();
  const user = users.find((u) => u.email === emailLower);
  
  if (!user) {
    // For security, don't reveal if email exists
    return { ok: true }; // Return success even if user doesn't exist
  }
  
  // Generate reset token
  const token = generateUUID();
  const resetData = {
    email: emailLower,
    token: token,
    expires: Date.now() + 3600000 // 1 hour
  };
  
  // Store reset token
  const tokens = JSON.parse(localStorage.getItem(K_RESET_TOKENS) || "[]");
  tokens.push(resetData);
  localStorage.setItem(K_RESET_TOKENS, JSON.stringify(tokens));
  
  // In production, send email with reset link
  // For now, return token for testing
  console.log(`Password reset token for ${email}: ${token}`);
  console.log(`Reset link: ${window.location.origin}/reset-password?token=${token}`);
  
  return { ok: true, token }; // In production, don't return token
}

export async function resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters" };
  }
  
  // Get reset tokens
  const tokens = JSON.parse(localStorage.getItem(K_RESET_TOKENS) || "[]");
  const resetData = tokens.find((t: any) => t.token === token);
  
  if (!resetData) {
    return { ok: false, error: "Invalid or expired reset token" };
  }
  
  if (Date.now() > resetData.expires) {
    return { ok: false, error: "Reset token has expired" };
  }
  
  // Update password
  const users = getLocalUsers();
  const userIndex = users.findIndex((u) => u.email === resetData.email);
  
  if (userIndex === -1) {
    return { ok: false, error: "User not found" };
  }
  
  users[userIndex].password = hashPassword(newPassword);
  saveLocalUsers(users);
  
  // Remove used token
  const updatedTokens = tokens.filter((t: any) => t.token !== token);
  localStorage.setItem(K_RESET_TOKENS, JSON.stringify(updatedTokens));
  
  // Clear any existing sessions for this user
  const session = getSession();
  if (session && session.email === resetData.email) {
    clearSession();
  }
  
  return { ok: true };
}

export function verifyResetToken(token: string): { valid: boolean; email?: string } {
  if (!isClient()) return { valid: false };
  
  const tokens = JSON.parse(localStorage.getItem(K_RESET_TOKENS) || "[]");
  const resetData = tokens.find((t: any) => t.token === token);
  
  if (!resetData) {
    return { valid: false };
  }
  
  if (Date.now() > resetData.expires) {
    return { valid: false };
  }
  
  return { valid: true, email: resetData.email };
}