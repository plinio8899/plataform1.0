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
    "repTrue" INTEGER NOT NULL,
    "cuestPoints" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");
