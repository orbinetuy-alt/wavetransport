-- CreateEnum
CREATE TYPE "DriverResponse" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "driverResponse" "DriverResponse";
