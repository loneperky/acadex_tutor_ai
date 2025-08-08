import { Navigate } from "react-router-dom";

// This component is no longer used - all traffic is redirected based on auth status
const Index = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
