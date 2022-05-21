-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "orderListId" INTEGER,
    "orderTypeId" TEXT NOT NULL,
    CONSTRAINT "Order_orderTypeId_fkey" FOREIGN KEY ("orderTypeId") REFERENCES "OrderType" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_orderListId_fkey" FOREIGN KEY ("orderListId") REFERENCES "OrderList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    CONSTRAINT "OrderList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderType" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prefMap" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderToOrderList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "OrderList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "forgotPasswordToken" TEXT,
    "verifyPasswordToken" TEXT,
    CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Vendor" ("vendorId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Preferences" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "firstName", "forgotPasswordToken", "id", "lastName", "password", "verifyPasswordToken") SELECT "email", "firstName", "forgotPasswordToken", "id", "lastName", "password", "verifyPasswordToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "OrderType_name_key" ON "OrderType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToOrderList_AB_unique" ON "_OrderToOrderList"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToOrderList_B_index" ON "_OrderToOrderList"("B");
