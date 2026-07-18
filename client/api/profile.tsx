import { baseURL } from "@/constants/api";
import { ExperienceLevel, UserProfile } from "@/types/User";

export type UpdateProfilePayload = {
  heightCm?: number | null;
  goalWeightKg?: number | null;
  experienceLevel?: ExperienceLevel | null;
};

export type CreateWeightEntryPayload = {
  weightKg: number;
  measuredAt?: string;
};

type UpdateProfileResponse = {
  message: string;
  profile: UserProfile;
};

type WeightEntry = {
  id: string;
  weightKg: number;
  measuredAt: string;
  createdAt: string;
  updatedAt: string;
};

type CreateWeightEntryResponse = {
  message: string;
  weightEntry: WeightEntry;
  currentWeightKg: number | null;
};

export const updateUserProfile = async (
  profile: UpdateProfilePayload,
  token: string,
): Promise<UpdateProfileResponse> => {
  const res = await fetch(`${baseURL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile.");
  }

  return data;
};

export const createUserWeightEntry = async (
  entry: CreateWeightEntryPayload,
  token: string,
): Promise<CreateWeightEntryResponse> => {
  const res = await fetch(`${baseURL}/profile/weight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to record weight.");
  }

  return data;
};
