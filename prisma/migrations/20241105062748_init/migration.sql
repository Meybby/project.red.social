/*
  Warnings:

  - Added the required column `userId` to the `Notificaciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notificaciones" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
