import { baseURL } from "@/constants/api";
import { Routine } from "@/types/Global";

type RoutinesResponse = {
  routines: Routine[];
  message: string;
};

type RoutineResponse = {
  routine: Routine;
  message: string;
};

export const addUserRoutine = async (
  routine: Routine,
  token: string,
): Promise<RoutineResponse> => {
  const res = await fetch(`${baseURL}/routines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(routine),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve user routines.");
  }

  return data;
};

export const getUserRoutines = async (
  token: string,
): Promise<RoutinesResponse> => {
  const res = await fetch(`${baseURL}/routines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to retrieve user routines.");
  }

  return data;
};

export const deleteUserRoutine = async (
  token: string,
  routineId: string,
): Promise<void> => {
  const res = await fetch(`${baseURL}/routines/${routineId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete user routine.");
  }
};
