import { baseURL } from "@/constants/api";
import { Exercise } from "@/types/Global";

type ExercisesResponse = {
  exercises: Exercise[];
  message: string;
};

type ExerciseResponse = {
  exercise: Exercise;
  message: string;
};

export const addUserExercise = async (
  exercise: Exercise,
  token: string,
): Promise<ExerciseResponse> => {
  const res = await fetch(`${baseURL}/exercises`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(exercise),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to add user exercise.");
  }

  return data;
};

export const getUserExercises = async (
  token: string,
): Promise<ExercisesResponse> => {
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

export const updateUserExercise = async (
  exercise: Exercise,
  token: string,
): Promise<ExerciseResponse> => {
  const res = await fetch(`${baseURL}/exercises/${exercise.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(exercise),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update user exercise.");
  }

  return data;
};
