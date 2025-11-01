import React from "react";
import { ProfileIcon } from "../ProfileIcon";
import { ActionButton } from "../Button";
import { CgSpinner } from "react-icons/cg";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  customSubtitle?: string;
  buttonText?: string;
  imageUrl?: string;
  children?: React.ReactNode;
  customImage?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  isError?: boolean;
  errorText?: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  buttonText = "Okay",
  imageUrl,
  children,
  customSubtitle,
  loading,
  loadingText = "Loading...",
  customImage,
  isError,
  errorText,
}) => {
  if (isOpen && !isError && !loading) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-500/30 transition-opacity duration-200 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`flex w-80 flex-col items-center gap-5 rounded-xl bg-white p-5 text-center shadow-lg`}
        >
          {customImage ?? <></>}
          {/* 图片部分 */}
          {imageUrl ? (
            <ProfileIcon
              imageUrl={imageUrl}
              size={"small"}
              alt="Image"
              isVerified
            />
          ) : (
            <></>
          )}
          <div className="flex flex-col items-center gap-1">
            {/* 标题 */}
            <h2 className="text-lg font-bold">{title}</h2>
            {customSubtitle ? (
              <p className="text-sm text-[#92969D]">{customSubtitle}</p>
            ) : (
              <></>
            )}
            {/* 描述内容（支持 HTML 传入）*/}
            <div className="text-gray-600">{children}</div>
          </div>
          {/* 按钮 */}
          <ActionButton
            extendedPaddingY
            variant="primary"
            label={buttonText}
            onClick={onClose}
          />
        </div>
      </div>
    );
  } else if (isOpen && isError) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-500/30 transition-opacity duration-200 ease-in-out">
        <div className="flex w-80 flex-col items-center gap-5 rounded-xl bg-white p-5 text-center shadow-lg">
          <h2 className="text-lg font-bold">{errorText}</h2>
          <ActionButton
            extendedPaddingY
            variant="primary"
            label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    );
  } else if (isOpen && loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-500/30 transition-opacity duration-200 ease-in-out">
        <div className="flex w-80 flex-col items-center gap-5 rounded-xl bg-white p-5 text-center shadow-lg">
          <h2 className="text-lg font-bold">{loadingText}</h2>
          <CgSpinner className="animate-spin" color="#41FAD3" size={28} />
        </div>
      </div>
    );
  }

  return null;
};

export default Popup;
