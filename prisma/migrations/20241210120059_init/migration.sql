-- CreateTable
CREATE TABLE `Trucks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `regn_no` VARCHAR(191) NOT NULL,
    `tires` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `body_type` ENUM('OPEN', 'CLOSED') NOT NULL,
    `axle_type` ENUM('SMALL', 'MEDIUM') NOT NULL,
    `expiration_time` DATETIME(3) NOT NULL,
    `posted_by` INTEGER NOT NULL,
    `pickup_point` VARCHAR(191) NOT NULL,
    `drop_point` VARCHAR(191) NOT NULL,
    `fare` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Trucks_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Materials_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weight` VARCHAR(191) NOT NULL,
    `material_type` INTEGER NOT NULL,
    `pickup_point` VARCHAR(191) NOT NULL,
    `drop_point` VARCHAR(191) NOT NULL,
    `expiration_time` DATETIME(3) NOT NULL,
    `posted_by` INTEGER NOT NULL,
    `fare` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `upatedAt` DATETIME(3) NOT NULL,
    `material_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Loads_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplyTransporter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `home_base` VARCHAR(191) NOT NULL,
    `viewed_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SupplyTransporter_id_key`(`id`),
    UNIQUE INDEX `SupplyTransporter_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandTransporter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `viewed_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DemandTransporter_id_key`(`id`),
    UNIQUE INDEX `DemandTransporter_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServicesView` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transporters` INTEGER NOT NULL,
    `loads` INTEGER NOT NULL,
    `trucks` INTEGER NOT NULL,

    UNIQUE INDEX `ServicesView_id_key`(`id`),
    UNIQUE INDEX `ServicesView_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaneRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pickup_point` VARCHAR(191) NOT NULL,
    `drop_point` VARCHAR(191) NOT NULL,
    `request_count` INTEGER NOT NULL,

    UNIQUE INDEX `LaneRequest_id_key`(`id`),
    UNIQUE INDEX `LaneRequest_pickup_point_drop_point_key`(`pickup_point`, `drop_point`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
