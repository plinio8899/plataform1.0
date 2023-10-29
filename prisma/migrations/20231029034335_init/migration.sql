-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER,
    "cuesStatus" INTEGER,
    "rango" TEXT,
    "rol" TEXT,
    "totalPoints" INTEGER,
    "sexo" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuest" (
    "id" SERIAL NOT NULL,
    "preg" TEXT NOT NULL,
    "op1" TEXT NOT NULL,
    "op2" TEXT NOT NULL,
    "op3" TEXT NOT NULL,
    "op4" TEXT NOT NULL,
    "repTrue" TEXT NOT NULL,
    "cuestPoints" INTEGER NOT NULL,

    CONSTRAINT "Cuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" SERIAL NOT NULL,
    "man" INTEGER NOT NULL,
    "woman" INTEGER NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sms" (
    "author" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Sms_pkey" PRIMARY KEY ("author")
);

-- CreateTable
CREATE TABLE "Feed" (
    "id" SERIAL NOT NULL,
    "author" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Codes" (
    "code" INTEGER NOT NULL,

    CONSTRAINT "Codes_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");
