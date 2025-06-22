// src/config/db/prismaClient.ts

import { PrismaClient } from "@prisma/client";
// No necesitamos importar envConfig aquí directamente si la DATABASE_URL está en el .env,
// ya que Prisma la lee automáticamente.
// Sin embargo, si quieres añadir opciones de logging o ciclo de vida, sigue siendo el lugar.

const prisma = new PrismaClient({
  // Opcional: Configuraciones de logging para ver las queries en desarrollo
  // log: ['query', 'info', 'warn', 'error'],
});

// Opcional: Desconexión de Prisma al cerrar la aplicación
// Esto es importante para una terminación limpia del proceso
process.on("beforeExit", async () => {
  console.log("Desconectando Prisma Client...");
  await prisma.$disconnect();
});

export default prisma;
