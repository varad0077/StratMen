export interface AllowedUser {
  email: string;
  name: string;
  role: string;
  isAdmin?: boolean;
}

// Pre-configured Admin for StratMen Foundation
export const INITIAL_ALLOWLIST: AllowedUser[] = [
  {
    email: 'castilinox890@gmail.com',
    name: 'StratChat Admin',
    role: 'StratChat Admin',
    isAdmin: true
  }
];

// Helper to check if email is permitted
export const isEmailAllowed = (email: string, list: AllowedUser[]): AllowedUser | undefined => {
  if (!email || !Array.isArray(list)) return undefined;
  const cleanEmail = email.trim().toLowerCase();
  return list.find((u) => u && u.email && u.email.toLowerCase() === cleanEmail);
};
