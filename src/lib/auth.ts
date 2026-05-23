export type User = { id: string; name: string; email: string };
type StoredUser = User & { password: string };

const K_USER = "safeguard:user";
const K_USERS = "safeguard:users";
const K_RESET_TOKENS = "safeguard:resetTokens";

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

export function currentUser(): User | null {
  if (!isClient()) return null;
  try { return JSON.parse(localStorage.getItem(K_USER) || "null"); } catch { return null; }
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

export async function register(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  try {
    const emailLower = email.trim().toLowerCase();
    
    // For now, use localStorage directly
    // Database integration will be enabled when environment is properly configured
    const users = getLocalUsers();
    if (users.some((u) => u.email === emailLower)) {
      return { ok: false, error: "Email already registered" };
    }
    
    const newUser: StoredUser = {
      id: generateUUID(),
      name: name.trim(),
      email: emailLower,
      password: password // In production with database, this will be hashed
    };
    
    users.push(newUser);
    saveLocalUsers(users);
    
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(K_USER, JSON.stringify(userData));
    
    return { ok: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { ok: false, error: "Registration failed. Please try again." };
  }
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!isClient()) return { ok: false, error: "Unavailable" };
  
  try {
    const emailLower = email.trim().toLowerCase();
    
    // Use localStorage
    const users = getLocalUsers();
    const user = users.find((u) => u.email === emailLower && u.password === password);
    
    if (!user) {
      return { ok: false, error: "Invalid email or password" };
    }
    
    const userData = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(K_USER, JSON.stringify(userData));
    
    return { ok: true };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, error: "Login failed. Please try again." };
  }
}

export function logout() {
  if (!isClient()) return;
  localStorage.removeItem(K_USER);
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
  
  users[userIndex].password = newPassword; // In production, hash this
  saveLocalUsers(users);
  
  // Remove used token
  const updatedTokens = tokens.filter((t: any) => t.token !== token);
  localStorage.setItem(K_RESET_TOKENS, JSON.stringify(updatedTokens));
  
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