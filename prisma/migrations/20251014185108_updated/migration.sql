/*
  Warnings:

  - You are about to drop the column `userName` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `name` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Employee_userName_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "userName",
ADD COLUMN     "name" TEXT NOT NULL;
