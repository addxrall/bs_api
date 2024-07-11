/*
  Warnings:

  - You are about to drop the column `book_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `reviewed_user_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_book_id_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "book_id",
ADD COLUMN     "reviewed_user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewed_user_id_fkey" FOREIGN KEY ("reviewed_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
