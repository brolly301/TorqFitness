export type ModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FormField<T> = {
  name: keyof T;
  placeholder: string;
  secureTextEntry?: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  gifUrl?: string;
  bodyParts: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  instructions: string[];
  archived?: boolean;
  userCreated?: boolean;
};

export type WorkoutSet = {
  id: string;
  order: number;
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSet[];
  notes?: string;
};

export type WorkoutDraft = {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  notes?: string | null;
};

export type Workout = WorkoutDraft & {
  startedAt: string | null;
  completedAt: string | null;
  duration: number;
};

export type Routine = WorkoutDraft;
