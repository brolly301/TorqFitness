import bcrypt from "bcryptjs";
import exercises from "./exercises.json";
import { prisma } from "../src/lib/prisma";

type ExerciseKey =
  | "inclineBench"
  | "shoulderPress"
  | "tricepPushdown"
  | "row"
  | "latPulldown"
  | "bicepCurl"
  | "squat"
  | "legCurl"
  | "calfRaise"
  | "deadlift";

type SetTemplate = {
  weight: number;
  reps: number;
};

type ExerciseTemplate = {
  exercise: ExerciseKey;
  sets: SetTemplate[];
};

const exerciseNames: Record<ExerciseKey, string> = {
  inclineBench: "barbell incline bench press",
  shoulderPress: "smith shoulder press",
  tricepPushdown: "cable one arm tricep pushdown",
  row: "smith narrow row",
  latPulldown: "reverse grip machine lat pulldown",
  bicepCurl: "lever bicep curl",
  squat: "barbell high bar squat",
  legCurl: "lever lying leg curl",
  calfRaise: "smith standing leg calf raise",
  deadlift: "barbell romanian deadlift",
};

const daysAgo = (days: number, hour = 18) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const workoutExercises = (
  templates: ExerciseTemplate[],
  exerciseIds: Record<ExerciseKey, string>,
) =>
  templates.map((template, exerciseIndex) => ({
    exerciseId: exerciseIds[template.exercise],
    order: exerciseIndex + 1,
    notes: null,
    sets: {
      create: template.sets.map((set, setIndex) => ({
        order: setIndex + 1,
        weight: set.weight,
        reps: set.reps,
      })),
    },
  }));

async function seedExerciseLibrary() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { jsonId: exercise.id },
      update: {
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        bodyParts: exercise.bodyParts,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        equipment: exercise.equipment,
        instructions: exercise.instructions,
        archived: false,
      },
      create: {
        jsonId: exercise.id,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        bodyParts: exercise.bodyParts,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        equipment: exercise.equipment,
        instructions: exercise.instructions,
        archived: false,
        userCreated: false,
      },
    });
  }
}

async function getExerciseIds() {
  const selectedExercises = await prisma.exercise.findMany({
    where: { name: { in: Object.values(exerciseNames) } },
    select: { id: true, name: true },
  });

  const ids = {} as Record<ExerciseKey, string>;

  for (const [key, name] of Object.entries(exerciseNames) as [
    ExerciseKey,
    string,
  ][]) {
    const exercise = selectedExercises.find((item) => item.name === name);

    if (!exercise) {
      throw new Error(`Seed exercise not found: ${name}`);
    }

    ids[key] = exercise.id;
  }

  return ids;
}

async function main() {
  await seedExerciseLibrary();
  const exerciseIds = await getExerciseIds();

  await prisma.user.deleteMany({
    where: { email: "demo@torq.local" },
  });

  const password = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.create({
    data: {
      firstName: "Demo",
      surname: "Athlete",
      email: "demo@torq.local",
      password,
      settings: {
        create: {
          theme: "Dark",
          fontSize: "medium",
          weightLabel: "kg",
        },
      },
      profile: {
        create: {
          heightCm: 178,
          goalWeightKg: 80,
          experienceLevel: "INTERMEDIATE",
        },
      },
      weightEntries: {
        create: [
          { weightKg: 86.4, measuredAt: daysAgo(84, 8) },
          { weightKg: 85.7, measuredAt: daysAgo(70, 8) },
          { weightKg: 84.9, measuredAt: daysAgo(56, 8) },
          { weightKg: 84.1, measuredAt: daysAgo(42, 8) },
          { weightKg: 83.6, measuredAt: daysAgo(28, 8) },
          { weightKg: 82.8, measuredAt: daysAgo(14, 8) },
          { weightKg: 82.3, measuredAt: daysAgo(3, 8) },
        ],
      },
    },
  });

  const pushRoutine = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Push Day",
      notes: "Chest, shoulders and triceps with controlled tempo.",
      exercises: {
        create: workoutExercises(
          [
            {
              exercise: "inclineBench",
              sets: [
                { weight: 60, reps: 10 },
                { weight: 65, reps: 8 },
                { weight: 65, reps: 8 },
              ],
            },
            {
              exercise: "shoulderPress",
              sets: [
                { weight: 35, reps: 10 },
                { weight: 37.5, reps: 8 },
                { weight: 37.5, reps: 8 },
              ],
            },
            {
              exercise: "tricepPushdown",
              sets: [
                { weight: 15, reps: 12 },
                { weight: 17.5, reps: 10 },
                { weight: 17.5, reps: 10 },
              ],
            },
          ],
          exerciseIds,
        ),
      },
    },
  });

  const pullRoutine = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Pull Day",
      notes: "Back and biceps. Pause briefly at peak contraction.",
      exercises: {
        create: workoutExercises(
          [
            {
              exercise: "row",
              sets: [
                { weight: 50, reps: 10 },
                { weight: 55, reps: 8 },
                { weight: 55, reps: 8 },
              ],
            },
            {
              exercise: "latPulldown",
              sets: [
                { weight: 45, reps: 12 },
                { weight: 50, reps: 10 },
                { weight: 50, reps: 9 },
              ],
            },
            {
              exercise: "bicepCurl",
              sets: [
                { weight: 20, reps: 12 },
                { weight: 22.5, reps: 10 },
                { weight: 22.5, reps: 9 },
              ],
            },
          ],
          exerciseIds,
        ),
      },
    },
  });

  const legRoutine = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Lower Body",
      notes: "Strength-focused lower body session.",
      exercises: {
        create: workoutExercises(
          [
            {
              exercise: "squat",
              sets: [
                { weight: 80, reps: 8 },
                { weight: 85, reps: 6 },
                { weight: 85, reps: 6 },
              ],
            },
            {
              exercise: "deadlift",
              sets: [
                { weight: 70, reps: 10 },
                { weight: 75, reps: 8 },
                { weight: 75, reps: 8 },
              ],
            },
            {
              exercise: "legCurl",
              sets: [
                { weight: 35, reps: 12 },
                { weight: 40, reps: 10 },
                { weight: 40, reps: 10 },
              ],
            },
            {
              exercise: "calfRaise",
              sets: [
                { weight: 50, reps: 15 },
                { weight: 55, reps: 12 },
                { weight: 55, reps: 12 },
              ],
            },
          ],
          exerciseIds,
        ),
      },
    },
  });

  const quickRoutine = await prisma.routine.create({
    data: {
      userId: user.id,
      name: "Quick Full Body",
      notes: "A shorter session for busy days.",
      exercises: {
        create: workoutExercises(
          [
            {
              exercise: "squat",
              sets: [
                { weight: 60, reps: 10 },
                { weight: 60, reps: 10 },
              ],
            },
            {
              exercise: "inclineBench",
              sets: [
                { weight: 50, reps: 10 },
                { weight: 50, reps: 10 },
              ],
            },
            {
              exercise: "row",
              sets: [
                { weight: 45, reps: 10 },
                { weight: 45, reps: 10 },
              ],
            },
          ],
          exerciseIds,
        ),
      },
    },
  });

  const workouts = [
    {
      name: "Push Day",
      routineId: pushRoutine.id,
      days: 2,
      duration: 3180,
      notes: "Strong session. Added weight to incline press.",
      exercises: [
        { exercise: "inclineBench" as const, sets: [[62.5, 10], [67.5, 8], [67.5, 7]] },
        { exercise: "shoulderPress" as const, sets: [[37.5, 10], [40, 8], [40, 7]] },
        { exercise: "tricepPushdown" as const, sets: [[17.5, 12], [20, 10], [20, 9]] },
      ],
    },
    {
      name: "Lower Body",
      routineId: legRoutine.id,
      days: 5,
      duration: 4020,
      notes: "Squats moved well today.",
      exercises: [
        { exercise: "squat" as const, sets: [[82.5, 8], [87.5, 6], [87.5, 6]] },
        { exercise: "deadlift" as const, sets: [[72.5, 10], [77.5, 8], [77.5, 8]] },
        { exercise: "legCurl" as const, sets: [[37.5, 12], [42.5, 10], [42.5, 9]] },
        { exercise: "calfRaise" as const, sets: [[55, 15], [60, 12], [60, 12]] },
      ],
    },
    {
      name: "Pull Day",
      routineId: pullRoutine.id,
      days: 8,
      duration: 3360,
      notes: "Kept every rep controlled.",
      exercises: [
        { exercise: "row" as const, sets: [[52.5, 10], [57.5, 8], [57.5, 8]] },
        { exercise: "latPulldown" as const, sets: [[47.5, 12], [52.5, 10], [52.5, 9]] },
        { exercise: "bicepCurl" as const, sets: [[22.5, 12], [25, 10], [25, 8]] },
      ],
    },
    {
      name: "Quick Full Body",
      routineId: quickRoutine.id,
      days: 12,
      duration: 2280,
      notes: "Short session before work.",
      exercises: [
        { exercise: "squat" as const, sets: [[62.5, 10], [62.5, 10]] },
        { exercise: "inclineBench" as const, sets: [[52.5, 10], [52.5, 9]] },
        { exercise: "row" as const, sets: [[47.5, 10], [47.5, 10]] },
      ],
    },
    {
      name: "Push Day",
      routineId: pushRoutine.id,
      days: 16,
      duration: 3060,
      notes: null,
      exercises: [
        { exercise: "inclineBench" as const, sets: [[60, 10], [65, 8], [65, 8]] },
        { exercise: "shoulderPress" as const, sets: [[35, 10], [37.5, 8], [37.5, 8]] },
        { exercise: "tricepPushdown" as const, sets: [[15, 12], [17.5, 10], [17.5, 10]] },
      ],
    },
    {
      name: "Lower Body",
      routineId: legRoutine.id,
      days: 20,
      duration: 3900,
      notes: "Last set of squats was challenging.",
      exercises: [
        { exercise: "squat" as const, sets: [[80, 8], [85, 6], [85, 5]] },
        { exercise: "deadlift" as const, sets: [[70, 10], [75, 8], [75, 8]] },
        { exercise: "legCurl" as const, sets: [[35, 12], [40, 10], [40, 10]] },
        { exercise: "calfRaise" as const, sets: [[50, 15], [55, 12], [55, 12]] },
      ],
    },
    {
      name: "Pull Day",
      routineId: pullRoutine.id,
      days: 25,
      duration: 3240,
      notes: null,
      exercises: [
        { exercise: "row" as const, sets: [[50, 10], [55, 8], [55, 8]] },
        { exercise: "latPulldown" as const, sets: [[45, 12], [50, 10], [50, 9]] },
        { exercise: "bicepCurl" as const, sets: [[20, 12], [22.5, 10], [22.5, 9]] },
      ],
    },
    {
      name: "Upper Body",
      routineId: null,
      days: 32,
      duration: 3480,
      notes: "Unplanned upper-body session.",
      exercises: [
        { exercise: "inclineBench" as const, sets: [[57.5, 10], [62.5, 8], [62.5, 8]] },
        { exercise: "row" as const, sets: [[47.5, 10], [52.5, 8], [52.5, 8]] },
        { exercise: "shoulderPress" as const, sets: [[32.5, 10], [35, 8], [35, 8]] },
      ],
    },
    {
      name: "Quick Full Body",
      routineId: quickRoutine.id,
      days: 41,
      duration: 2160,
      notes: null,
      exercises: [
        { exercise: "squat" as const, sets: [[57.5, 10], [57.5, 10]] },
        { exercise: "inclineBench" as const, sets: [[47.5, 10], [47.5, 10]] },
        { exercise: "row" as const, sets: [[42.5, 10], [42.5, 10]] },
      ],
    },
    {
      name: "Lower Body",
      routineId: legRoutine.id,
      days: 48,
      duration: 3780,
      notes: "First week back after a deload.",
      exercises: [
        { exercise: "squat" as const, sets: [[75, 8], [80, 6], [80, 6]] },
        { exercise: "deadlift" as const, sets: [[65, 10], [70, 8], [70, 8]] },
        { exercise: "legCurl" as const, sets: [[32.5, 12], [37.5, 10], [37.5, 10]] },
        { exercise: "calfRaise" as const, sets: [[47.5, 15], [52.5, 12], [52.5, 12]] },
      ],
    },
    {
      name: "Pull Day",
      routineId: pullRoutine.id,
      days: 56,
      duration: 3120,
      notes: "Good baseline session.",
      exercises: [
        { exercise: "row" as const, sets: [[45, 10], [50, 8], [50, 8]] },
        { exercise: "latPulldown" as const, sets: [[40, 12], [45, 10], [45, 10]] },
        { exercise: "bicepCurl" as const, sets: [[17.5, 12], [20, 10], [20, 10]] },
      ],
    },
    {
      name: "Push Day",
      routineId: pushRoutine.id,
      days: 63,
      duration: 2940,
      notes: "Starting point for this training block.",
      exercises: [
        { exercise: "inclineBench" as const, sets: [[55, 10], [60, 8], [60, 8]] },
        { exercise: "shoulderPress" as const, sets: [[30, 10], [32.5, 8], [32.5, 8]] },
        { exercise: "tricepPushdown" as const, sets: [[12.5, 12], [15, 10], [15, 10]] },
      ],
    },
  ];

  for (const workout of workouts) {
    const completedAt = daysAgo(workout.days);
    const startedAt = new Date(
      completedAt.getTime() - workout.duration * 1000,
    );

    await prisma.workout.create({
      data: {
        userId: user.id,
        routineId: workout.routineId,
        name: workout.name,
        notes: workout.notes,
        startedAt,
        completedAt,
        duration: workout.duration,
        exercises: {
          create: workoutExercises(
            workout.exercises.map((exercise) => ({
              exercise: exercise.exercise,
              sets: exercise.sets.map(([weight, reps]) => ({ weight, reps })),
            })),
            exerciseIds,
          ),
        },
      },
    });
  }

  console.log("Exercise library and demo data seeded.");
  console.log("Demo login: demo@torq.local / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
