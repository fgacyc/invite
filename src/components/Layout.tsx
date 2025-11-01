import { Outlet } from "react-router";
import { HeaderNav } from "./Header";
import {
  TitleContext,
  TitleContextProvider,
} from "@/providers/TitleContextProvider";
import { useContext } from "react";

const LayoutContent = () => {
  const { title, rightIcon, fixed, white, bg, hasUnsavedChanges, showBack } =
    useContext(TitleContext);
  return (
    <div className="relative flex h-screen flex-col">
      <HeaderNav
        title={title}
        rightIcon={rightIcon}
        bg={bg}
        white={white}
        fixed={fixed}
        hasUnsavedChanges={hasUnsavedChanges}
        showBack={showBack}
      />
      <main className="relative flex h-full flex-grow flex-col">
        <Outlet />
      </main>
    </div>
  );
};

const Layout = () => {
  return (
    <TitleContextProvider>
      <LayoutContent />
    </TitleContextProvider>
  );
};

export default Layout;
