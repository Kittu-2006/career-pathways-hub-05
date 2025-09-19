import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, AuthState } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  student: {
    id: "1",
    email: "student@example.com",
    name: "Alex Johnson",
    role: "student",
    department: "Computer Science",
    year: 3,
  },
  mentor: {
    id: "2",
    email: "mentor@example.com",
    name: "Dr. Sarah Wilson",
    role: "mentor",
    department: "Computer Science",
  },
  placement_cell: {
    id: "3",
    email: "placement@example.com",
    name: "Placement Officer",
    role: "placement_cell",
    department: "Placement Cell",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string, role: UserRole) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any credentials and return mock user based on role
    const user = mockUsers[role];
    setAuthState({
      user: { ...user, email }, // Use the provided email
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}