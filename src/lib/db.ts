// // Rest of the code remains the same
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// declare global {
//   interface Window {
//     prisma: unknown;
//   }
// }

// const prisma = window.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") window.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
