import { Link } from "react-router-dom";
import "./styles.scss";

const Button = ({
  variant = "contained",
  size = "sm",
  color = "primary",
  className = "fs-15 fw-700",
  style = {},
  fullWidth = false,
  underline = false,
  underlineOver = false,
  href = "",
  onClick = () => { },
  onDoubleClick = () => { },
  children,
  disabled = false,
  target = "_blank"
}) => {
  const preColor = ["primary", "secondary", "default", "error", "success"];
  const isPreColor = preColor.includes(color);
  const buttonStyle = !isPreColor && variant === "link" ?
    { borderColor: color, color: color } : !isPreColor && variant === "outlined" ?
      { borderColor: color, color: color } : !isPreColor ? { backgroungColor: color } : {};

  return href ? (
    <Link to={href} aria-label={children} onClick={onClick} target={target} className={`${variant} ${size}${underline ? " underline" : ""}${underlineOver ? " underlineOver" : ""}${className ? ` ${className}` : ''}${isPreColor ? ` ${color}` : " otherColor"}${fullWidth ? " fullWidth" : ""}`} style={{ ...style, ...buttonStyle }}>
      {children}
    </Link>
  ) : (
    <button aria-label={"button"} onClick={onClick} onDoubleClick={onDoubleClick} disabled={disabled} className={`${variant} ${size}${underline ? " underline" : ""}${underlineOver ? " underlineOver" : ""}${className ? ` ${className}` : ''}${isPreColor ? ` ${color}` : " otherColor"}${fullWidth ? " fullWidth" : ""}`} style={{ ...style, ...buttonStyle }}>
      {children}
    </button>
  );
};

export default Button;