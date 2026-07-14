import { User } from "./index";

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  success: boolean;
  message?: string;
  devOtp?: string; // Optional: sent in dev mode for testing
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
  user: User;
  isProfileComplete: boolean;
}

export interface ProfileRequest {
  name: string;
  email: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  avatar?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface EmailSendRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SMSSendRequest {
  to: string;
  body: string;
}
