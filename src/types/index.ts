export interface User {
  id: string;
  phone: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  bio?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  isProfileComplete: boolean;
  isActive: boolean;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OTP {
  id: string;
  phone: string;
  code: string;
  expiresAt: Date | string;
  verified: boolean;
  attempts: number;
  createdAt: Date | string;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
