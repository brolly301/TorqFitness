import { getUserSettings, updateUserSettings } from "@/api/settings";
import { ThemeType } from "@/types/Theme";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./UserContext";

export type FontSizeType = "small" | "medium" | "large";
export type WeightLabelType = "kg" | "lb";

export type SettingsType = {
  theme: ThemeType;
  fontSize: FontSizeType;
  weightLabel: WeightLabelType;
};

type SettingsContextType = {
  settings: SettingsType | null;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType | null>>;
  updateSetting: <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K],
  ) => void;
};
const SettingContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsType | null>({
    theme: "Light",
    fontSize: "medium",
    weightLabel: "kg",
  });

  const { authToken } = useUserContext();

  useEffect(() => {
    getSettings();
  }, [authToken.token]);

  const getSettings = async () => {
    try {
      if (!authToken.token) return;

      const res = await getUserSettings(authToken.token);

      setSettings(res.settings);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      console.log(message);
    }
  };

  const updateSetting = async <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K],
  ) => {
    if (!authToken.token) return;

    await updateUserSettings(key, value, authToken.token);

    setSettings((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  return (
    <SettingContext.Provider value={{ settings, updateSetting, setSettings }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingContext);

  if (!context)
    throw new Error("useSettingContext must be inside SettingProvider");

  return context;
};
