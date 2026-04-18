/*
  Warnings:

  - You are about to drop the column `font` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "font",
ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT 'medium',
ALTER COLUMN "theme" SET DEFAULT 'Light';
