module.exports = {
  appId: 'ua.farmasoft.rh',
  productName: 'Farmasoft RH',
  directories: {
    output: 'release',
    buildResources: 'assets',
  },
  files: [
    'dist/**/*',
    'dist-electron/**/*',
    'node_modules/**/*',
    '!node_modules/.cache/**/*',
    '!node_modules/electron/**/*',
    '!node_modules/electron-builder/**/*',
    '!node_modules/vite/**/*',
    '!node_modules/typescript/**/*',
    'package.json',
  ],
  extraMetadata: {
    main: 'dist-electron/main.js',
  },
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
  },
  mac: {
    target: 'dmg',
    category: 'public.app-category.business',
  },
  linux: {
    target: 'AppImage',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    runAfterFinish: true,
    installerLanguages: ['uk_UA', 'fr_FR'],
    language: 1036,
  },
  publish: null,
}
