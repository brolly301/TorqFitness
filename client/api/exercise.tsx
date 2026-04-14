import { baseURL } from "@/constants/api";
import { Exercise } from "@/types/Global";

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
