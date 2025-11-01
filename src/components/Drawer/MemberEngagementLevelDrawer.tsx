import { InfoOutlined } from "@mui/icons-material";
import Drawer from "./Drawer";
import ActivityIndicator, {
  type ActivityIndicatorProps,
} from "../ActivityIndicator";

interface MemberEngagementLevelDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const levels: (ActivityIndicatorProps & { title: string; desc: string })[] = [
  {
    level: "high",
    title: "Highly Engaged (95% and above)",
    desc: "Members who actively participate in both service and cell group events 95% or more of the time.",
  },
  {
    level: "medium",
    title: "Moderately Engaged (94% to 75%)",
    desc: "Members who participate in events regularly but have room for improvement in attendance.",
  },
  {
    level: "low",
    title: "Low Engagement (50% and below)",
    desc: "Members who rarely attend events and may need follow-up to re-engage.",
  },
  {
    level: "none",
    title: "Absent for 1 Month",
    desc: "Members who haven't attended any events for the past month. Consider reaching out to check on them.",
  },
];

export const MemberEngagementLevelDrawer = ({
  open,
  setOpen,
}: MemberEngagementLevelDrawerProps) => {
  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      icon={<InfoOutlined />}
      title="Member Engagement Level"
    >
      <div className="flex w-full flex-col gap-5">
        {levels.map((level) => (
          <div key={level.level} className="flex w-full flex-col gap-1">
            <div className="flex flex-row items-center gap-1">
              <ActivityIndicator level={level.level} />
              <p className="text-dark text-xs font-medium">{level.title}</p>
            </div>
            <p className="text-gray text-[10px]">{level.desc}</p>
          </div>
        ))}
      </div>
    </Drawer>
  );
};
