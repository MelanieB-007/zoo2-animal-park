import { PrismaClient } from '@prisma/client';
import PageWrapper from "../../components/page-structure/PageWrapper"; // Pfad ggf. anpassen

const prisma = new PrismaClient();

export default function TierDetail({ animal }) {
  if (!animal) return <div>Tier nicht gefunden...</div>;

  return (
    <PageWrapper>
      <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#2d5a27' }}>{animal.name}</h1>
        <p>ID: {animal.id}</p>

        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Details:</h3>
          <ul>
            <li>Preis: {animal.preis}</li>
            <li>Stalllevel: {animal.stalllevel}</li>
            <li>Release: {animal.release}</li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const animalData = await prisma.tiere.findUnique({
    where: { id: parseInt(id) },
  });

  if (!animalData) return { notFound: true };

  return {
    props: {
      animal: JSON.parse(JSON.stringify(animalData)),
    },
  };
}