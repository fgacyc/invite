import { CgSpinner } from "react-icons/cg";

export interface ActionButtonProps {
  label: string;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: "primary" | "secondary" | "warning";
  disabled?: boolean;
  rounded?: "small" | "default";
  type?: HTMLButtonElement["type"];
  extendedPaddingY?: boolean;
  loading?: boolean;
  extendedClassName?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  rounded = "default",
  extendedPaddingY = false,
  type = "button",
  loading = false,
  extendedClassName,
}) => {
  return (
    <button
      type={type}
      className={`w-full rounded-4xl ${extendedClassName} ${loading ? "flex flex-row items-center justify-center" : ""} ${
        rounded === "small" ? "rounded-lg" : "rounded-4xl"
      } px-2 ${extendedPaddingY ? "py-2" : "py-1"} ${disabled ? "opacity-10" : ""} ${
        variant === "primary"
          ? "bg-dark font-bold text-white"
          : variant === "secondary"
            ? "text-dark bg-white/95"
            : "bg-white/95 text-[#FF0000]"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? (
        <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
      ) : (
        label
      )}
    </button>
  );
};

interface ButtonProps {
  label: string;
  onClick: (() => void) | (() => Promise<void>);
  disabled?: boolean;
  type?: HTMLButtonElement["type"];
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`text-dark rounded-lg px-2 py-0.5 text-xs font-semibold leading-6 ${
        disabled
          ? "cursor-not-allowed bg-gray-400 opacity-50"
          : "bg-neon-green"
      }`}
    >
      {label}
    </button>
  );
};
