/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Issue` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `Issue` DROP COLUMN `updateAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `assignedToUserId` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
