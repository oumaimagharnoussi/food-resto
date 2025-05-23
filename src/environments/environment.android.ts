// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// This config is for android emulator
// You must replace this config with your own local IP address
export const environment = {
    production: false,
    BACKEND: 'http://192.168.1.7:8000',
    API: 'http://192.168.1.7:8000/api/',
    S3_url: 'https://dev-rd-food.s3.eu-north-1.amazonaws.com/document/',
    SSE_url: 'http://192.168.1.7:3000',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
