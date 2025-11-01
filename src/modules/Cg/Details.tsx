import { InfoOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState, useContext } from "react";
import { TitleContext } from "@/providers/TitleContextProvider";
import { Icon } from "@/components/Icon";

import { MemberEngagementLevelDrawer } from "@/components/Drawer/MemberEngagementLevelDrawer";

import {
  useCGDetails,
  useCGMembers,
  usePendingCGInvites,
} from "@/graphql/hooks/connect-group";
import { CgSpinner } from "react-icons/cg";
import { MemberListItem } from "@/components/MemberListItem";
import { CGHeader } from "./Header";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

// Sort members by pastoral role weight
// Priority: weight 4 first, then ascending (1, 2, 3, 5, 6, 7, 8...)
const sortByRoleWeight = (a: { weight?: number }, b: { weight?: number }) => {
  const weightA = a.weight ?? 999;
  const weightB = b.weight ?? 999;

  // Both have weight 4 - maintain order
  if (weightA === 4 && weightB === 4) return 0;
  // A has weight 4 - A comes first
  if (weightA === 4) return -1;
  // B has weight 4 - B comes first
  if (weightB === 4) return 1;

  // Neither has weight 4 - sort ascending
  return weightA - weightB;
};

const Details = () => {
  const { id } = useParams();
  const { user } = useAuth0();

  useEffect(() => {
    if (id) {
      sessionStorage.setItem("currentCgId", id);
    }
  }, [id]);

  const { setTitle, setBg, setFixed, setWhite, setShowBack } =
    useContext(TitleContext);

  const [memberEngagementDrawerOpen, setMemberEngagementDrawerOpen] =
    useState(false);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: cgDetails } = useCGDetails(id ?? "");
  const cgId = cgDetails?.connect_groupCollection.edges[0]?.node.id ?? "";

  const { data } = useCGMembers(cgId);
  const { data: pendingInvitesData } = usePendingCGInvites(cgId);

  const members =
    data?.connect_groupCollection.edges.flatMap((a) =>
      a.node.user_connect_groupCollection.edges.map((b) => ({
        ...b.node.user,
        role: b.node.user_role,
        weight: b.node.pastoral_role?.weight,
      })),
    ) ?? [];

  // Get the logged-in user's pending invite (if exists)
  // Note: user.sub from Auth0 should match invite.node.user.id (the database user ID)
  const userPendingInvite =
    pendingInvitesData?.connect_group_inviteCollection.edges.find(
      (invite) => invite.node.user.id === user?.sub,
    );

  // Create a member object from the pending invite
  const pendingMember = userPendingInvite
    ? {
        ...userPendingInvite.node.user,
        role: "Pending",
        weight: 1000, // High weight to ensure it appears at top when sorted
        isPending: true,
      }
    : null;

  // Merge pending member (if exists) with current members
  const allMembers = pendingMember ? [pendingMember, ...members] : [...members];

  // Create filters with pending user IDs

  useEffect(() => {
    setTitle("CG Details");
    setBg("#242424");
    setWhite(true);
    setFixed(true);
    setShowBack(false);
  }, [setTitle, setBg, setWhite, setFixed, setShowBack]);

  return (
    <>
      <MemberEngagementLevelDrawer
        open={memberEngagementDrawerOpen}
        setOpen={setMemberEngagementDrawerOpen}
      />

      <div className="h-full w-full">
        <CGHeader
          members={members ?? []}
          hasPendingInvite={!!userPendingInvite}
        />
        <div className="flex w-full flex-col gap-3 px-4 pt-3">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex w-full flex-row items-center gap-1">
              <p className="text-base font-bold">Members</p>
              <button
                type="button"
                onClick={() => {
                  setMemberEngagementDrawerOpen(true);
                }}
                className="flex items-center"
              >
                <InfoOutlined
                  sx={{
                    fontSize: 24,
                  }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 rounded-sm border border-[rgba(0,0,0,0.13)] px-3 py-2.5">
            <input
              ref={searchRef}
              type="text"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search member"
              className="placeholder:text-gray text-dark w-full text-sm"
            />
            <Icon
              onClick={() => {
                searchRef.current?.focus();
              }}
              iconName="search"
              type="outlined"
              size={20}
            />
          </div>

          <div className="flex h-full w-full flex-grow flex-col">
            {allMembers && allMembers?.length > 0 ? (
              (() => {
                // Separate pending member from regular members
                const filteredMembers = allMembers.filter((a) =>
                  (a.name ?? "")
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
                );

                const pending = filteredMembers.find(
                  (m) => (m as typeof pendingMember)?.isPending,
                );
                const regular = filteredMembers.filter(
                  (m) => !(m as typeof pendingMember)?.isPending,
                );

                // Sort regular members
                const sortedRegular = [...regular].sort(sortByRoleWeight);

                // Combine: pending first, then sorted regular members
                const finalList = pending
                  ? [pending, ...sortedRegular]
                  : sortedRegular;

                return finalList.map((member) => {
                  return (
                    <MemberListItem
                      key={member.id}
                      member={member}
                      pendingInvite={
                        (member as typeof pendingMember)?.isPending
                          ? userPendingInvite?.node
                          : undefined
                      }
                    />
                  );
                });
              })()
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
                <p className="text-center">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
