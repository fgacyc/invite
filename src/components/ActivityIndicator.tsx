import React from "react";

export interface ActivityIndicatorProps {
  level: "high" | "medium" | "low" | "none";
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({ level }) => {
  const colorMap = {
    high: {
      bg: "bg-[#00BA93]",
      shadow: "drop-shadow(0px 0px 5.8px rgba(0, 186, 147, 0.5))",
    },
    medium: {
      bg: "bg-[#F6B100]",
      shadow: "drop-shadow(0px 0px 5.8px rgba(244, 181, 16, 0.5))",
    },
    low: {
      bg: "bg-[#FF0000]",
      shadow: "drop-shadow(0px 0px 5.8px rgba(255, 3, 3, 0.5))",
    },
    none: { bg: "bg-[#D9D9D9]", shadow: "unset" },
  };

  const activeLines = {
    high: 3,
    medium: 2,
    low: 1,
    none: 0,
  };

  return (
    <div className="flex max-h-3 min-h-3 max-w-3 min-w-3 flex-col items-center gap-0.5">
      {new Array(3).fill(null).map((_, index) => (
        <div
          style={{ filter: colorMap[level].shadow }}
          key={index}
          className={`w-full grow ${index < 3 - activeLines[level] ? "bg-[#D9D9D9]" : activeLines[level] > 0 ? colorMap[level].bg : "bg-[#D9D9D9]"} rounded-[1px]`}
        />
      ))}
    </div>
  );
};

export default ActivityIndicator;
