import exercises from "./exercises.json";
import { prisma } from "../src/lib/prisma";

async function main() {
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { jsonId: ex.id },
      update: {
        name: ex.name,
        gifUrl: ex.gifUrl,
        bodyParts: ex.bodyParts,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        equipment: ex.equipment,
        instructions: ex.instructions,
      },
      create: {
        jsonId: ex.id,
        name: ex.name,
        gifUrl: ex.gifUrl,
        bodyParts: ex.bodyParts,
        primaryMuscles: ex.primaryMuscles,
        secondaryMuscles: ex.secondaryMuscles,
        equipment: ex.equipment,
        instructions: ex.instructions,
        archived: false,
        userCreated: false,
      },
    });
  }
}

main()
  .then(() => console.log("Exercises seeded."))
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
