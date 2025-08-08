import { Layout } from "@/components/Layout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as ToasterComponent } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AskQuestion from "./pages/AskQuestion";
import BetaPage from "./pages/Beta";
import Bookmarks from "./pages/Bookmarks";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Quizzes from "./pages/Quizzes";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import CompleteProfile from "./pages/completeProfile";
import { ChatProvider } from "./context/ChatContext";
import SessionTracker from "./components/SessionTracker";
import { useAuth } from "./context/AuthContext";
import { WatchPage } from "./pages/WatchPage";
const queryClient = new QueryClient();

const App = () => {

  const location = useLocation();

  // const { loading } = useAuth();

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
  //       Loading session...
  //     </div>
  //   );
  // }

  // Show navbar only on public pages
  const showNavbar = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <TooltipProvider>
            <ToasterComponent />
            <SessionTracker />
            <Toaster />
            <Sonner />

            {showNavbar && <Navbar />}

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />


              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ask"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AskQuestion />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:chatId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AskQuestion />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CompleteProfile />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Quizzes />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bookmarks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Bookmarks />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Resources />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/watch/:videoId"
                element={
                  <ProtectedRoute>
                    <WatchPage />
                  </ProtectedRoute>

                }
              />

              <Route
                path="/beta"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <BetaPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
