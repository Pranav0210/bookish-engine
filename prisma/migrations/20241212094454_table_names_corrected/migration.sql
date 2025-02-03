/*
  Warnings:

  - You are about to drop the `demandtransporter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lanerequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicesview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplytransporter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `demandtransporter` DROP FOREIGN KEY `DemandTransporter_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `servicesview` DROP FOREIGN KEY `ServicesView_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `supplytransporter` DROP FOREIGN KEY `SupplyTransporter_user_id_fkey`;

-- DropTable
DROP TABLE `demandtransporter`;

-- DropTable
DROP TABLE `lanerequest`;

-- DropTable
DROP TABLE `servicesview`;

-- DropTable
DROP TABLE `supplytransporter`;

-- CreateTable
CREATE TABLE `suppply_transporter` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `home_base` VARCHAR(191) NOT NULL,
    `viewed_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `suppply_transporter_id_key`(`id`),
    UNIQUE INDEX `suppply_transporter_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `demand_transporter` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `viewed_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `demand_transporter_id_key`(`id`),
    UNIQUE INDEX `demand_transporter_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services_views` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `transporters` INTEGER NOT NULL,
    `loads` INTEGER NOT NULL,
    `trucks` INTEGER NOT NULL,

    UNIQUE INDEX `services_views_id_key`(`id`),
    UNIQUE INDEX `services_views_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lane_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pickup_point` VARCHAR(191) NOT NULL,
    `drop_point` VARCHAR(191) NOT NULL,
    `request_count` INTEGER NOT NULL,

    UNIQUE INDEX `lane_request_id_key`(`id`),
    UNIQUE INDEX `lane_request_pickup_point_drop_point_key`(`pickup_point`, `drop_point`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `suppply_transporter` ADD CONSTRAINT `suppply_transporter_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `demand_transporter` ADD CONSTRAINT `demand_transporter_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services_views` ADD CONSTRAINT `services_views_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
