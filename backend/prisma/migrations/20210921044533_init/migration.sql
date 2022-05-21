-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "forgotPasswordToken" TEXT,
    "verifyPasswordToken" TEXT,
    CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Vendor" ("vendorId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendorId" INTEGER NOT NULL,
    "vendorName" TEXT NOT NULL,
    "vendorLongName" TEXT
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorId_key" ON "Vendor"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
