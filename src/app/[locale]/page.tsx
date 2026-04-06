import HomeContent from "@/components/pages/home/HomeContent";
import { prisma } from "@/lib/prisma";

export default async function IndexPage() {
  const [tierCount, habitatCount, variantCount] = await Promise.all([
    prisma.tiere.count(),
    prisma.gehege.count(),
    prisma.farbvarianten?.count() || 0,
  ]);

  return (
    <HomeContent
      stats={{
        tiere: tierCount,
        gehege: habitatCount,
        varianten: variantCount,
      }}
    />
  );
}