import styles from "./Input.module.css";

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}) {
  return (
    <div className={[styles.wrapper, className].join(" ")}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input className={[styles.input, icon ? styles.withIcon : "", error ? styles.hasError : ""].join(" ")} {...props} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
