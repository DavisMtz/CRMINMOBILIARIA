import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import Button from "../../components/ui/Button";
import styles from "./LoginPage.module.css";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 35.4 26.8 36 24 36c-5.2 0-9.6-3.2-11.3-7.8l-6.5 5C9.5 39.4 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.5 5.9l.1-.1 6.2 5.2C36.8 39.8 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { user, profile, loading } = useAuth();
  const { loginWithGoogle } = useGoogleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(profile ? "/dashboard" : "/onboarding", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  const handleLogin = async () => {
    const u = await loginWithGoogle();
    if (u) {
      // AuthContext will update; useEffect handles redirect
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>A</div>
          <span className={styles.logoText}>Atarax</span>
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>Bienvenido</h1>
          <p className={styles.subtitle}>
            Plataforma CRM para asesores inmobiliarios.<br />
            Inicia sesión para continuar.
          </p>
        </div>

        <Button
          size="lg"
          fullWidth
          onClick={handleLogin}
          icon={<GoogleIcon />}
          className={styles.googleBtn}
        >
          Continuar con Google
        </Button>

        <p className={styles.terms}>
          Al ingresar aceptas los{" "}
          <a href="#">Términos de servicio</a> y la{" "}
          <a href="#">Política de privacidad</a>.
        </p>
      </div>
    </div>
  );
}
