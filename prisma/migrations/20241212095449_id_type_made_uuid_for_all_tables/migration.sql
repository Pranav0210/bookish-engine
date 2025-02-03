/*
  Warnings:

  - The primary key for the `lane_request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `loads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `materials` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `services_views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trucks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `lane_request` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `loads` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `materials` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `services_views` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `trucks` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
