import styles from "./button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}: ButtonProps) {
  const className = variant === "primary" ? styles.primary : styles.ghost;

  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
