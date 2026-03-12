import prisma from '../lib/db'; // Pfad zu deiner db.js anpassen

export async function getServerSideProps() {
  try {
    // Ein einfacher Test-Query
    await prisma.$queryRaw`SELECT 1`;
    return { props: { status: 'Erfolg: Verbindung zu TiDB steht!' } };
  } catch (e) {
    return { props: { status: 'Fehler: ' + e.message } };
  }
}

export default function DbTest({ status }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Datenbank-Check</h1>
      <p>{status}</p>
    </div>
  );
}