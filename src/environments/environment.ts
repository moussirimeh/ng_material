// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
export const globals = {
  apiBaseUrl : 'http://localhost:8200/rest/',
  smsApi: 'http://localhost:8080/',
  societe: '',
  adresse: '',
  selectedMenu: '',
  //                       jamel ,   Touhemi junior , 'tijani'   phoneNumbers
  phonesNumberIndest : ['58308170',    '53920215' , '58460430'  ],
  // tslint:disable-next-line:max-line-length
  //                   Nabil,     'ahlem',    'hanen' ,   Mondher ,   feyza ,      wassila   ,  Habib   , Aymen   ,  trabelssi ,   fathi  ,     maher      , chawachi  phoneNumbers
  // tslint:disable-next-line:max-line-length   12
  phonesNumberSMD: [ '50501335', '50501340', '58300862', '50501338', '50501331', '58308169', '50501317', '50501337' , '50501334', '58525402' , '50501330' , '50501333'  ],
  // tslint:disable-next-line:max-line-length
  phonesNumberAut :  [ '50501335', '50501340', '58300862', '50501338', '50501331', '58308169', '50501317', '50501337' , '50501334', '58525402' , '50501330' , '50501333'  ],
  // tslint:disable-next-line:max-line-length
  phonesNumberHard :  [ '50501335', '50501340', '58300862', '50501338', '50501331', '58308169', '50501317', '50501337' , '50501334', '58525402' , '50501330' , '50501333'  ],
  //                   khaled    , sameh     phoneNumbers
  phonesNumberCdg : ['50515453', '58355456']
};
