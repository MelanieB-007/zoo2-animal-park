import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function HomePage() {
  // 'common' bezieht sich auf die Datei public/locales/de/common.json
  const { t } = useTranslation('common');

  return (
    <p>
      {/* Der Key 'welcome_message' muss in deiner JSON existieren */}
      {t('welcome_message')}
    </p>
  );
}

// Er lädt die Sprachdateien serverseitig für diese Seite.
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}