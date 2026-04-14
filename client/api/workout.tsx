import { baseURL } from "@/constants/api";
import { Workout } from "@/types/Global";

type WorkoutResponse = {
  workouts: Workout[];
  message: string;
};

export const addUserWorkout = async (
  workout: Workout,
  token: string,
): Promise<Response> => {
  return fetch(`${baseURL}/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(workout),
  });
};

export const getUserWorkouts = async (
  token: string,
): Promise<WorkoutResponse> => {
  const res = await fetch(`${baseURL}/workouts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve user workouts.");
  }

  return data;
};

export const deleteUserWorkout = async (
  token: string,
  workoutId: string,
): Promise<void> => {
  const res = await fetch(`${baseURL}/workouts/${workoutId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete user workouts.");
  }
};
