module.exports = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  },
  // Das hilft, falls die Pfade in manchen Umgebungen nicht gefunden werden
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};