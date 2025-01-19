/*
  Warnings:

  - The `typeId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserType` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('Video', 'Article');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_typeId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "typeId",
ADD COLUMN     "typeId" INTEGER;

-- AlterTable
ALTER TABLE "UserType" DROP CONSTRAINT "UserType_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserType_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "duration" INTEGER,
    "body" TEXT,
    "type" "ActivityType" NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_url_key" ON "Activity"("url");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "UserType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
