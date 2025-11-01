import { ProfileIcon } from "./ProfileIcon";
import { useLatestCGAttendance } from "@/graphql/hooks/attendance";
import type { CGMemberUser } from "@/types/graphql";
import { usePastoralRole } from "@/graphql";
import ActivityIndicator from "./ActivityIndicator";
import { getLevelfromAttendanceDate } from "@/utils/index";
import { RoleTag } from "./RoleTag";

export const MemberListItem: React.FC<{
  member: CGMemberUser & { weight?: number };
  pendingInvite?: {
    cg_id: string;
    status: string;
    connect_group: {
      id: string;
      name: string;
      satellite: {
        id: string;
        name: string;
      };
    };
  };
}> = ({ member, pendingInvite }) => {
  const { data } = useLatestCGAttendance(member.id);
  const { data: pastoralRole } = usePastoralRole(member.id);
  const pastoralRoleWeight =
    member.weight ??
    pastoralRole?.user_connect_groupCollection.edges[0]?.node.pastoral_role
      ?.weight;

  if (!member) return null;

  const attendanceData = data?.latest_attendance.edges[0]?.node;
  const attendanceDate = attendanceData?.created_at;

  // Determine if this is a shadow user
  const isShadowUser = member.id.startsWith("shadow|");

  // Check if user has pending invite
  const hasPendingInvite = !!pendingInvite;

  return (
    <div
      key={member.id}
      className={`flex flex-row items-center justify-between py-2 ${hasPendingInvite ? "rounded-md border border-[#41FAD3] bg-[#41FAD3]/10 px-3" : ""}`}
    >
      <div className="flex flex-row items-center gap-2">
        <ProfileIcon
          isVerified={!isShadowUser}
          imageUrl={
            member.avatar_url ??
            `https://placehold.co/40x40?text=${member.name?.replaceAll(" ", "+") ?? "User"}`
          }
          size="mini"
          userId={member.id}
          hasPendingInvite={hasPendingInvite}
        />
        <div className="flex flex-col">
          <div className="flex flex-row items-center gap-1">
            {hasPendingInvite ? (
              <span className="rounded bg-[#41FAD3] px-2 py-px text-xs font-semibold text-gray-900">
                Pending
              </span>
            ) : (
              <RoleTag pastoralRoleWeight={pastoralRoleWeight} />
            )}
            <p className="text-sm font-semibold">{member.name}</p>
          </div>
          {hasPendingInvite && (
            <p className="text-[10px] text-gray-600">
              Your request is pending approval
            </p>
          )}
        </div>
      </div>
      {!hasPendingInvite && (
        <ActivityIndicator
          level={getLevelfromAttendanceDate(attendanceDate ?? "")}
        />
      )}
    </div>
  );
};
