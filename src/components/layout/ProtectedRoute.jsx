import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function OnboardingGuard({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile) return <Navigate to="/dashboard" replace />;
  return children;
}

export function DashboardGuard({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <AppLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
}

function AppLoader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--gray-50)",
    }}>
      <div style={{
        width: 40, height: 40,
        border: "3px solid var(--gray-200)",
        borderTopColor: "var(--brand)",
        borderRadius: "50%",
        animation: "spin .65s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
