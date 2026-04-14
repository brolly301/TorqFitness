/*
  Warnings:

  - A unique constraint covering the columns `[jsonId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "jsonId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_jsonId_key" ON "Exercise"("jsonId");
