import { ActionButton, type ActionButtonProps } from "./Button";

interface ButtonGroupProps {
  btns: ActionButtonProps[];
  rounded?: "small" | "default";
  direction?: "row" | "col";
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  btns,
  direction = "col",
  rounded = "default",
}) => {
  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row"} gap-3`}
    >
      {btns.map((btn) => (
        <ActionButton
          key={`${btn.label}-${btn.variant}`}
          variant={btn.variant}
          label={btn.label}
          disabled={btn.disabled}
          onClick={btn.onClick}
          rounded={rounded}
          extendedClassName={btn.extendedClassName}
          extendedPaddingY={btn.extendedPaddingY}
        />
      ))}
    </div>
  );
};
