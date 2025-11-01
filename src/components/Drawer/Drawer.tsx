import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { CloseOutlined } from "@mui/icons-material";

interface DrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  icon?: React.ReactNode;
  title?: string;
  noHeaderSpace?: boolean;
  children: React.ReactNode[] | React.ReactNode;
}

export default function Drawer({
  open,
  setOpen,
  icon,
  title,
  noHeaderSpace,
  children,
}: DrawerProps) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-[998]"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-h-full pt-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative max-h-[80vh] w-full transform transition duration-500 ease-in-out data-closed:translate-y-full sm:duration-700"
            >
              <div className="flex h-full flex-col gap-8 overflow-y-scroll rounded-t-xl bg-white px-4 py-6 shadow-xl sm:px-6">
                {!noHeaderSpace && (
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-1">
                      {icon ?? ""}
                      <DialogTitle className="text-base font-semibold text-gray-900">
                        {title ?? ""}
                      </DialogTitle>
                    </div>
                    <TransitionChild>
                      <div className="duration-500 ease-in-out data-closed:opacity-0">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md text-[#92969D] focus:outline-hidden"
                        >
                          <span className="sr-only">Close panel</span>
                          <CloseOutlined
                            aria-hidden="true"
                            className="size-[16px]"
                          />
                        </button>
                      </div>
                    </TransitionChild>
                  </div>
                )}
                <div className="relative">{children}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

