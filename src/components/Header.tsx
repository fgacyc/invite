import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router";
import { useState } from "react";
import Dialog from "./Dialog/Dialog";
import { IoLogOut } from "react-icons/io5";
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderNavProps {
  title: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
  white?: boolean;
  fixed?: boolean;
  bg?: `#${string}` | "transparent";
  hasUnsavedChanges?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  showBack,
  rightIcon,
  white = false,
  fixed = false,
  bg = "transparent",
  hasUnsavedChanges = false,
}) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { logout } = useAuth0();

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmDialog(false);
    navigate(-1);
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div
        style={{ backgroundColor: bg === "transparent" ? "transparent" : bg }}
        className={`top-0 z-[998] flex w-full flex-row items-center justify-between px-4 py-6.5 ${white ? "text-white" : ""} ${fixed ? "fixed" : "sticky"}`}
      >
        <div className="h-6 w-6">
          {showBack && (
            <GoChevronLeft
              onClick={handleBackClick}
              className="cursor-pointer"
              role="button"
              size={24}
            />
          )}
        </div>
        <p className="absolute left-1/2 max-w-[75%] -translate-x-1/2 truncate text-xl font-bold whitespace-nowrap">
          {title}
        </p>
        <div className="h-6 w-6">
          {
            <IoLogOut
              className="text-neon-green rotate-180 cursor-pointer"
              size={24}
              role="button"
              onClick={() => {
                logout();
              }}
            />
          }
        </div>
      </div>

      <Dialog
        isOpen={showConfirmDialog}
        title="Unsaved Changes"
        cancelText="Stay"
        confirmText="Leave"
        onCancel={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
      >
        <p>
          You have unsaved changes. Are you sure you want to leave this page?
        </p>
      </Dialog>
    </>
  );
};
