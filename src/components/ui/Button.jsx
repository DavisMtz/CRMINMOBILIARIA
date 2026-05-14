import styles from "./Button.module.css";

const variants = { primary: "primary", secondary: "secondary", ghost: "ghost", danger: "danger" };
const sizes = { sm: "sm", md: "md", lg: "lg" };

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  className = "",
  ...props
}) {
  return (
    <button
      className={[
        styles.btn,
        styles[variants[variant] ?? "primary"],
        styles[sizes[size] ?? "md"],
        fullWidth ? styles.full : "",
        loading ? styles.loading : "",
        className,
      ].join(" ")}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
