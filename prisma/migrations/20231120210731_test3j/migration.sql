/*
  Warnings:

  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `privateFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "privateFiles" ADD COLUMN     "url" TEXT NOT NULL;
