/*
  Warnings:

  - Changed the type of `action` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `keyName` on the `Metadata` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MetadataKey" AS ENUM ('THEME', 'LANGUAGE', 'NOTIFICATIONS', 'TIMEZONE', 'DISPLAY_MODE', 'EMAIL_PREFERENCES');

-- CreateEnum
CREATE TYPE "AuditLogAction" AS ENUM ('USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'PERMISSION_ADDED', 'PERMISSION_REMOVED', 'PROFILE_UPDATE', 'PASSWORD_CHANGED', 'SETTINGS_UPDATED');

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "action",
ADD COLUMN     "action" "AuditLogAction" NOT NULL;

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "keyName",
ADD COLUMN     "keyName" "MetadataKey" NOT NULL;

-- DropEnum
DROP TYPE "type";
