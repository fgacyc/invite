import { GroupRounded } from "@mui/icons-material";
import { type GetCGMembersResponse } from "@/types/graphql";
import { useCGDetails, useSatellite } from "@/graphql/hooks/connect-group";
import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router";

interface CGHeaderProps {
  members: GetCGMembersResponse["connect_groupCollection"]["edges"][0]["node"]["user_connect_groupCollection"]["edges"][0]["node"]["user"][];
  hasPendingInvite?: boolean;
}

export const CGHeader: React.FC<CGHeaderProps> = ({
  members,
  hasPendingInvite = false,
}) => {
  const cgId = sessionStorage.getItem("currentCgId");
  const { data, isLoading } = useCGDetails(cgId ?? "");

  const { data: satellite } = useSatellite(
    data?.connect_groupCollection.edges[0]?.node.satellite_id ?? "",
  );

  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = data?.connect_groupCollection.edges[0]?.node.image_url;

  const navigate = useNavigate();

  // Reset image loaded state when image URL changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  return (
    <div className="header-bg flex w-full flex-col gap-3 rounded-b-[18px] px-4 pt-19 pb-5 text-white">
      <div className="flex w-full flex-col gap-5 pt-11">
        <p className="text-sm font-bold">
          Satellite: {satellite?.satelliteCollection.edges[0]?.node.name}
        </p>
        <div className="relative min-h-[230px] w-full">
          {(isLoading || !imageLoaded) && (
            <div className="absolute inset-0 min-h-[230px] w-full animate-pulse rounded-sm bg-white/20" />
          )}
          {!isLoading && (
            <img
              src={
                imageUrl ??
                `https://placehold.co/350x170?text=${data?.connect_groupCollection.edges[0]?.node.name}`
              }
              alt="Cover"
              className={`min-h-[230px] w-full rounded-sm object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <p className="text-lg font-bold">
            {data?.connect_groupCollection.edges[0]?.node.name}
          </p>
        </div>
        <Button
          label={hasPendingInvite ? "Pending..." : "Join Group!"}
          onClick={() => {
            if (!hasPendingInvite) {
              navigate("/cg/profile");
            }
          }}
          disabled={hasPendingInvite}
        />
      </div>
      <div className="text-info-gray flex flex-col gap-1.5">
        <div className="flex flex-row items-center gap-1">
          <p className="text-sm">{members.length ?? 0}</p>
          <GroupRounded
            sx={{
              fontSize: 12,
            }}
          />
        </div>
        {/* <div className="flex flex-row items-center gap-1">
          <p className="text-sm">CG Name: {cgName}</p>
          <ContentCopyRounded
            sx={{
              fontSize: 14,
            }}
            role="button"
          />
        </div> */}
        {/* <div className="flex flex-row items-center gap-1.5">
          <p className="text-sm">
            {satellite?.satelliteCollection.edges[0]?.node.name}
          </p>
          <div className="bg-info-gray h-[8px] w-[1px]" />
          <p className="text-sm">Daniel Seakny Team</p>
          <div className="bg-info-gray h-[8px] w-[1px]" />
          <p className="text-sm">M2 Junior</p>
        </div> */}
      </div>
      {data?.connect_groupCollection.edges[0]?.node.description ? (
        <p className="text-sm">
          {data?.connect_groupCollection.edges[0]?.node.description}
        </p>
      ) : null}
    </div>
  );
};
