import { baseURL } from "@/constants/api";
import { Exercise } from "@/types/Global";

type WorkoutResponse = {
  exercises: Exercise[];
  message: string;
};

export const addUserExercise = async (
  exercise: Exercise,
  token: string,
): Promise<Response> => {
  return fetch(`${baseURL}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(exercise),
  });
};

export const getUserExercises = async (
  token: string,
): Promise<WorkoutResponse> => {
  const res = await fetch(`${baseURL}/exercises`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve user exercises.");
  }

  return data;
};

export const archiveUserExercise = async (
  token: string,
  exerciseId: string,
): Promise<void> => {
  const res = await fetch(`${baseURL}/exercises/${exerciseId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to archive user exercise.");
  }
};
