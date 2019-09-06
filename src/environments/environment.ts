// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    hmr: false,
    appConfig: 'appconfig.json',
    firebase: {
        apiKey: 'AIzaSyBNVk4X3dZl6uonfAU2vKGoyAITYag1TXY',
        authDomain: 'masisebenzefce.firebaseapp.com',
        databaseURL: 'https://masisebenzefce.firebaseio.com',
        projectId: 'masisebenzefce',
        storageBucket: 'masisebenzefce.appspot.com',
        messagingSenderId: '81682531252',
        appId: '1:484971481636:web:dd0c9128b55fbf421e66b1'
    },
};
