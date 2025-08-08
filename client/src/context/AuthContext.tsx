// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { AuthContextType } from "../types";

// Axios global setup
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5050";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  document.cookie.split(';').forEach(c => console.log(c.trim()));

  // Detect password reset flow
  const isResetFlow = () => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path.includes("/reset-password") && hash.includes("type=recovery");
  };

  const isOnResetPage = window?.location?.pathname.includes('/reset-password');
  const isRecoveryFlow = window?.location?.hash?.includes('type=recovery');

  useEffect(() => {
    const initialize = async () => {
      if (isResetFlow()) {
        console.log("Skipping auth init during password reset.");
        setLoading(false);
        return;
      }

      try {
        // Try to get user (accessToken still valid)
        const userRes = await axios.get("/user/profile");
        setUser(userRes.data.user);
        console.log("✅ Session restored via accessToken", userRes.data.user);
      } catch (err) {
        console.warn("🔄 Access token expired, trying refresh...");

        try {
          await axios.post("/auth/refresh-token");
          const userRes = await axios.get("/user/profile");
          setUser(userRes.data.user);
          console.log("✅ Session restored via refreshToken", userRes.data.user);
        } catch (refreshError) {
          console.error("❌ Refresh failed:", refreshError);
          setUser(null); // Not authenticated
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);



  // Fetch authenticated user, auto-refresh if unauthorized
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/user/profile");
      setUser(data.user);
      console.log(data.user)
    } catch (err) {
      console.error("🚫 Fetch user failed:", err);
      setUser(null);
    }
  };

  // Signup
  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/signup", { fullName, email, password });
      setUser(data.user);
      return true;
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data?.error || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const UpdateProfile = async (
    academic_level: string,
    study_field: string,
    institution: string,
    country: string,
    phone_number: string,
    language: string,
    linkedin: string,
    website: string,
    dob: string,
    gender: string,
    research_interest: string,
    bio: string,
    avatar_url: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { data } = await axios.patch("/user/profile", {
        academic_level,
        study_field,
        institution,
        country,
        phone_number,
        language,
        linkedin,
        website,
        dob,
        gender,
        research_interest,
        bio,
        avatar_url,
      })
      setUser(data.user)
      return true
    } catch (error) {
      console.error("Error updating user profile:", error.response?.data || error.message);
      return false
    } finally {
      setLoading(false)
    }
  }

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/signin", { email, password });
      setUser(data.user);
      return true;
    } catch (err: any) {
      console.error("Login Error:", err.response?.data?.error || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setUser(null);
    }
  };

  const deleteAcc = async () => {
    try {
      await axios.post('/auth/delete')
      setUser(null)
    } catch (error) {
      console.log('failed to delete', error)
    } finally {
      setUser(null)
    }
  }

  // Forgot Password
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/forgot-password", { email });
      return { success: true, message: data.message || "Check your inbox" };
    } catch (err: any) {
      console.error("Forgot Password Error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send reset link.",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fetchUser,
        login,
        logout,
        deleteAcc,
        forgotPassword,
        signup,
        setUser,
        loading,
        UpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
