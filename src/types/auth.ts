export type UserRole = "student" | "mentor" | "placement_cell";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  year?: number; // For students
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}