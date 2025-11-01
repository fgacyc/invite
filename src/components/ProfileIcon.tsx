import React, { useState } from "react";
import { GoCheckCircleFill } from "react-icons/go";
import { usePendingInvites } from "@/providers/PendingInvitesProvider";

interface ProfileIconProps {
  imageUrl: string;
  isVerified?: boolean;
  size?: "mini" | "small" | "medium" | "large" | "xlarge";
  alt?: string;
  hideBorder?: boolean;
  hasPendingInvite?: boolean;
  userId?: string; // Optional user ID to automatically check for pending invites
}

const SIZES = {
  mini: {
    container: 40,
    badge: 16,
  },
  small: {
    container: 52,
    badge: 20,
  },
  medium: {
    container: 68,
    badge: 24,
  },
  large: {
    container: 80,
    badge: 28,
  },
  xlarge: {
    container: 92,
    badge: 38,
  },
};

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  imageUrl,
  isVerified = false,
  size = "medium",
  alt = "Profile picture",
  hideBorder,
  hasPendingInvite = false,
  userId,
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const pendingInvitesContext = usePendingInvites();

  // Check if user has pending invite - either from prop or from context
  const hasPending =
    hasPendingInvite ||
    Boolean(userId && pendingInvitesContext?.pendingInvitesMap.has(userId));

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <div
      className="relative"
      style={{
        width: `${SIZES[size].container}px`,
        height: `${SIZES[size].container}px`,
      }}
    >
      {imageUrl && !hasImageError ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`h-full w-full rounded-full ${hideBorder ? "" : `border border-white ${size === "mini" ? "p-px" : size === "small" ? "p-0.5" : "p-1"}`} bg-white object-cover`}
          onError={handleImageError}
        />
      ) : (
        <div
          className={`h-full w-full rounded-full ${hideBorder ? "" : `border border-white ${size === "mini" ? "p-px" : size === "small" ? "p-0.5" : "p-1"}`} flex items-center justify-center bg-gray-200`}
        >
          <div className="text-center text-gray-500">
            <span className="text-lg">👤</span>
          </div>
        </div>
      )}
      <GoCheckCircleFill
        className="absolute -right-0.5 -bottom-0.5 rounded-full border border-white bg-white"
        style={{
          color: hasPending ? "#4D52FF" : isVerified ? "#22c55e" : "#9ca3af",
        }}
        size={SIZES[size].badge}
      />
    </div>
  );
};
