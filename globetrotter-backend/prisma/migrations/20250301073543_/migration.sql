/*
  Warnings:

  - The `clues` column on the `Destination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `funFact` column on the `Destination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `trivia` column on the `Destination` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "clues",
ADD COLUMN     "clues" TEXT[],
DROP COLUMN "funFact",
ADD COLUMN     "funFact" TEXT[],
DROP COLUMN "trivia",
ADD COLUMN     "trivia" TEXT[];

-- AlterTable
ALTER TABLE "GameSession" ALTER COLUMN "maxWrongAnswers" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
