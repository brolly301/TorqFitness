import { baseURL } from "@/constants/api";
import { Workout } from "@/types/Global";

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
