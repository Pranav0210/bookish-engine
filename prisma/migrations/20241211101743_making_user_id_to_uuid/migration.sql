/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `DemandTransporter` DROP FOREIGN KEY `DemandTransporter_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Loads` DROP FOREIGN KEY `Loads_posted_by_fkey`;

-- DropForeignKey
ALTER TABLE `ServicesView` DROP FOREIGN KEY `ServicesView_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `SupplyTransporter` DROP FOREIGN KEY `SupplyTransporter_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Trucks` DROP FOREIGN KEY `Trucks_posted_by_fkey`;

-- AlterTable
ALTER TABLE `DemandTransporter` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Loads` MODIFY `posted_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ServicesView` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SupplyTransporter` MODIFY `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Trucks` MODIFY `posted_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Trucks` ADD CONSTRAINT `Trucks_posted_by_fkey` FOREIGN KEY (`posted_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loads` ADD CONSTRAINT `Loads_posted_by_fkey` FOREIGN KEY (`posted_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyTransporter` ADD CONSTRAINT `SupplyTransporter_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandTransporter` ADD CONSTRAINT `DemandTransporter_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServicesView` ADD CONSTRAINT `ServicesView_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
