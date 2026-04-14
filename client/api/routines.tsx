import { baseURL } from "@/constants/api";
import { Routine } from "@/types/Global";

export const addUserRoutine = async (
  routine: Routine,
  token: string,
): Promise<Response> => {
  return fetch(`${baseURL}/routines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(routine),
  });
};
