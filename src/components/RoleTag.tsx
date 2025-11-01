import { Flag } from "@mui/icons-material";

export const RoleTag: React.FC<{
  pastoralRoleWeight?: number;
  borderColor?: string;
  flagSize?: "small" | "medium" | "large" | "inherit";
}> = ({ pastoralRoleWeight, borderColor, flagSize = "small" }) => {
  // Weight 4 = CG Leader → show flag
  if (pastoralRoleWeight === 4) {
    return <Flag className="text-dark-neon-green" fontSize={flagSize} />;
  }

  // Weight 8 = New Friend → show NF badge
  if (pastoralRoleWeight === 8) {
    return (
      <div
        style={{
          borderColor: borderColor ?? "#191d1a",
        }}
        className="rounded-[2px] border px-[3px] py-[1px] text-[10px]"
      >
        NF
      </div>
    );
  }

  // All other weights → show nothing
  return null;
};
