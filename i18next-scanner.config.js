module.exports = {
  input: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/i18n/**',
    '!**/node_modules/**',
  ],
  output: './src/i18n/locales/',
  options: {
    debug: true,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx'],
    },
    lngs: ['en', 'zh'],
    ns: [
      'common',
      'prompt',
      'settings'
    ],
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: (lng, ns, key) => {
      if (lng === 'en') {
        return key;
      }
      return '[需要翻译]'; // 表示需要翻译 | Indicates translation needed
    },
    resource: {
      loadPath: '{{lng}}/{{ns}}.json',
      savePath: '{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: ':',
    keySeparator: '.',
    pluralSeparator: '_',
    contextSeparator: '_',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
}; 