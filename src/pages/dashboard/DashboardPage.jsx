import { useAuth } from "../../hooks/useAuth";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { Users, TrendingUp, Home, Calendar, LogOut, Bell, ChevronDown } from "lucide-react";
import styles from "./DashboardPage.module.css";

const STATS = [
  { label: "Clientes activos", value: "0", icon: <Users size={22} />, color: "#4F46E5", bg: "#EEF2FF" },
  { label: "Propiedades",      value: "0", icon: <Home size={22} />,  color: "#10B981", bg: "#ECFDF5" },
  { label: "Citas esta semana",value: "0", icon: <Calendar size={22} />, color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Ventas del mes",   value: "$0", icon: <TrendingUp size={22} />, color: "#06B6D4", bg: "#ECFEFF" },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { logout } = useGoogleAuth();
  const name = profile?.displayName ?? user?.displayName ?? "Asesor";
  const photo = profile?.photoURL ?? user?.photoURL;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}>A</div>
          <span>Atarax</span>
        </div>

        <nav className={styles.nav}>
          {[
            { icon: <Home size={18} />, label: "Dashboard", active: true },
            { icon: <Users size={18} />, label: "Clientes" },
            { icon: <Home size={18} />, label: "Propiedades" },
            { icon: <Calendar size={18} />, label: "Agenda" },
            { icon: <TrendingUp size={18} />, label: "Reportes" },
          ].map((item) => (
            <button key={item.label} className={[styles.navItem, item.active ? styles.navActive : ""].join(" ")}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userChip}>
            {photo ? (
              <img src={photo} alt={name} className={styles.userAvatar} />
            ) : (
              <div className={styles.userAvatarFallback}>{name[0]}</div>
            )}
            <div className={styles.userInfo}>
              <span className={styles.userName}>{name}</span>
              <span className={styles.userRole}>Asesor</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageGreeting}>Bienvenido de nuevo, {name.split(" ")[0]}</p>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn}><Bell size={18} /></button>
            <div className={styles.topbarUser}>
              {photo ? (
                <img src={photo} alt={name} className={styles.topbarAvatar} />
              ) : (
                <div className={styles.userAvatarFallback}>{name[0]}</div>
              )}
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Empty state */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Home size={40} />
          </div>
          <h3>Tu CRM está listo</h3>
          <p>Comienza agregando tus primeros clientes o propiedades para ver tu actividad aquí.</p>
        </div>
      </main>
    </div>
  );
}
