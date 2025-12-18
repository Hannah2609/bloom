import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Tilføj serverExternalPackages for at sikre Prisma virker korrekt
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],
};

export default nextConfig;
