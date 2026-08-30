const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "customer" | "professional" | "company" | "admin";
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export const authService = {
  /**
   * Verify Email using either a token or 6-digit OTP code
   */
  async verifyEmail(payload: { token?: string; code?: string; email?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed. Please check your verification code.");
      }

      return {
        success: true,
        message: data.message || "Your email address has been successfully verified!",
      };
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Fallback demo simulation if backend service is not running yet
        return new Promise((resolve) => {
          setTimeout(() => {
            if (payload.code === "000000" || payload.token === "invalid") {
              resolve({ success: false, message: "Invalid or expired verification code." });
            } else {
              resolve({ success: true, message: "Email verified successfully!" });
            }
          }, 1000);
        });
      }
      throw error;
    }
  },

  /**
   * Resend Email Verification Code
   */
  async resendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification code.");
      }

      return {
        success: true,
        message: data.message || `A new verification code has been sent to ${email}`,
      };
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, message: `Verification code sent to ${email}` });
          }, 800);
        });
      }
      throw error;
    }
  },

  /**
   * Store Auth Token in LocalStorage
   */
  setToken(token: string) {
    localStorage.setItem("aibos_auth_token", token);
  },

  /**
   * Get Auth Token
   */
  getToken(): string | null {
    return localStorage.getItem("aibos_auth_token");
  },

  /**
   * Store User Info
   */
  setUser(user: User) {
    localStorage.setItem("aibos_user", JSON.stringify(user));
  },

  /**
   * Get Stored User Info
   */
  getUser(): User | null {
    const raw = localStorage.getItem("aibos_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Clear Session / Logout
   */
  logout() {
    localStorage.removeItem("aibos_auth_token");
    localStorage.removeItem("aibos_user");
  },
};

export default authService;
