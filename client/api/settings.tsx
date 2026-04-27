import { SupportField, SupportFormType } from "@/app/(tabs)/profile/support";
import { baseURL } from "@/constants/api";
import { SettingsType } from "@/context/SettingsContext";

type SettingsResponse = {
  settings: SettingsType;
  message: string;
};

type SupportFormPayload = Partial<Record<SupportField, string>>;

export const updateUserSettings = async (
  type: string,
  value: string,
  token: string,
): Promise<{ message: string }> => {
  const res = await fetch(`${baseURL}/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, value }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to updateuser settings");
  }

  return data;
};

export const getUserSettings = async (
  token: string,
): Promise<SettingsResponse> => {
  const res = await fetch(`${baseURL}/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve user settings");
  }

  return data;
};

export const submitUserContactForm = async (
  type: SupportFormType,
  formData: SupportFormPayload,
  token: string,
): Promise<SettingsResponse> => {
  const res = await fetch(`${baseURL}/settings/contact/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve send contact form.");
  }

  return data;
};
