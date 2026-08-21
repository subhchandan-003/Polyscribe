"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type UserRole = "doctor" | "patient";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo credentials
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "doc-1",
    name: "Dr. Priya Sharma",
    role: "doctor",
    email: "doctor@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-2",
    name: "Dr. Arjun Mehta",
    role: "doctor",
    email: "arjun.mehta@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-3",
    name: "Dr. Kavita Iyer",
    role: "doctor",
    email: "kavita.iyer@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-4",
    name: "Dr. Rohan Verma",
    role: "doctor",
    email: "rohan.verma@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-5",
    name: "Dr. Ananya Reddy",
    role: "doctor",
    email: "ananya.reddy@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-6",
    name: "Dr. Vikram Nair",
    role: "doctor",
    email: "vikram.nair@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-7",
    name: "Dr. Sneha Kapoor",
    role: "doctor",
    email: "sneha.kapoor@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-8",
    name: "Dr. Aditya Rao",
    role: "doctor",
    email: "aditya.rao@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-9",
    name: "Dr. Meera Joshi",
    role: "doctor",
    email: "meera.joshi@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "doc-10",
    name: "Dr. Karan Malhotra",
    role: "doctor",
    email: "karan.malhotra@polyscribe.io",
    password: "doctor123",
  },
  {
    id: "pat-1",
    name: "Rahul Mehta",
    role: "patient",
    email: "patient@polyscribe.io",
    password: "patient123",
  },
  {
    id: "pat-2",
    name: "Anjali Nair",
    role: "patient",
    email: "anjali.nair@polyscribe.io",
    password: "patient123",
  },
  {
    id: "pat-3",
    name: "Suresh Kumar",
    role: "patient",
    email: "suresh.kumar@polyscribe.io",
    password: "patient123",
  },
  {
    id: "pat-4",
    name: "Meera Pillai",
    role: "patient",
    email: "meera.pillai@polyscribe.io",
    password: "patient123",
  },
  {
    id: "pat-5",
    name: "Arjun Das",
    role: "patient",
    email: "arjun.das@polyscribe.io",
    password: "patient123",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("polyscribe_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("polyscribe_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid credentials" };
    }
    const { password: _, ...userData } = found;
    setUser(userData);
    sessionStorage.setItem("polyscribe_user", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("polyscribe_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
