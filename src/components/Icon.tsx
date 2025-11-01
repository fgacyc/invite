interface IconProps {
  iconName: string;
  className?: string;
  type: "outlined" | "rounded" | "sharp";
  fill?: boolean;
  size?: number;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  iconName,
  className = "",
  type,
  fill,
  size,
  onClick,
}) => {
  return (
    <span
      role={onClick ? "button" : "img"}
      onClick={onClick}
      style={{
        fontSize: `${size ?? 24}px`,
      }}
      className={`material-symbols-${type} ${fill ? "fill" : ""} ${className}`}
    >
      {iconName}
    </span>
  );
};
