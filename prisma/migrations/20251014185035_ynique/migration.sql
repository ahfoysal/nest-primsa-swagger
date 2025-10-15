/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Employee_userName_key" ON "Employee"("userName");
