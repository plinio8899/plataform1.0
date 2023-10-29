-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER,
    "cuesStatus" INTEGER,
    "rango" TEXT,
    "rol" TEXT,
    "totalPoints" INTEGER,
    "sexo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "preg" TEXT NOT NULL,
    "op1" TEXT NOT NULL,
    "op2" TEXT NOT NULL,
    "op3" TEXT NOT NULL,
    "op4" TEXT NOT NULL,
    "repTrue" TEXT NOT NULL,
    "cuestPoints" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "man" INTEGER NOT NULL,
    "woman" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Sms" (
    "author" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Feed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Codes" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");
