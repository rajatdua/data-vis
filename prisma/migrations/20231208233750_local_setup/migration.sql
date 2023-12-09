-- CreateTable
CREATE TABLE `Tweet` (
    `id` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `content` VARCHAR(5000) NOT NULL,
    `date` INTEGER NOT NULL,
    `retweets` INTEGER NOT NULL,
    `favorites` INTEGER NOT NULL,
    `mentions` VARCHAR(191) NOT NULL,
    `hashtags` VARCHAR(191) NOT NULL,
    `time_before` INTEGER NOT NULL,
    `time_after` INTEGER NOT NULL,
    `sentiment` DOUBLE NOT NULL,

    UNIQUE INDEX `Tweet_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
