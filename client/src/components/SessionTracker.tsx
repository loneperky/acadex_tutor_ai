// components/SessionTracker.tsx
import React from "react";
import useSessionTracker from "@/hooks/useSessionTracker";
import { useAuth } from "@/context/AuthContext";

const SessionTracker = () => {
  const { user } = useAuth();

  useSessionTracker(user?.id || null);

  return null; // This component doesn’t render anything
};

export default SessionTracker;
