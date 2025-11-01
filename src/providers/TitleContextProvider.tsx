import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

export const TitleContext = createContext<{
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  rightIcon: React.ReactNode;
  setRightIcon: Dispatch<SetStateAction<React.ReactNode>>;
  white: boolean;
  setWhite: Dispatch<SetStateAction<boolean>>;
  fixed: boolean;
  setFixed: Dispatch<SetStateAction<boolean>>;
  bg: `#${string}` | "transparent";
  setBg: Dispatch<SetStateAction<`#${string}` | "transparent">>;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  showBack: boolean;
  setShowBack: Dispatch<SetStateAction<boolean>>;
}>({
  title: "",
  setTitle: () => undefined, // provide explicit return value
  fixed: false,
  setFixed: () => undefined,
  rightIcon: null,
  setRightIcon: () => undefined,
  white: false,
  setWhite: () => undefined,
  bg: "transparent",
  setBg: () => undefined,
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => undefined,
  showBack: false,
  setShowBack: () => undefined,
});

export const TitleContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [title, setTitle] = useState("");
  const [rightIcon, setRightIcon] = useState<React.ReactNode>(null);
  const [bg, setBg] = useState<`#${string}` | "transparent">("transparent");
  const [white, setWhite] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBack, setShowBack] = useState(false);
  return (
    <TitleContext.Provider
      value={{
        title,
        fixed,
        setFixed,
        setTitle,
        rightIcon,
        setRightIcon,
        bg,
        setBg,
        white,
        setWhite,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showBack,
        setShowBack,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
