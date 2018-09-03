import { customElement, property } from '@polymer/decorators';
import { PolymerElement, html } from '@polymer/polymer';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { SomeDoc, SomeDocRef, UserDb } from './types';

const config = {
  apiKey: 'AIzaSyCo2KHYejiPSWy87d3sj-VZwQH1WH2nync',
  authDomain: 'polymer-webpack-test.firebaseapp.com',
  databaseURL: 'https://polymer-webpack-test.firebaseio.com',
  projectId: 'polymer-webpack-test',
  storageBucket: 'polymer-webpack-test.appspot.com',
  messagingSenderId: '156679740222'
};
firebase.initializeApp(config);

@customElement('firebase-service')
export class FirebaseService extends PolymerElement {

  @property({ type: Object, notify: true })
  public user: UserDb | null;

  // Public
  public firestore: Firestore;
  public fireAuth: FireAuth;

  // Authentication
  public async login() {
    this.user = await this.fireAuth.loginGoogle();
  }
  public async logout() {
    this.user = await this.fireAuth.logout();
  }

  // Life cycle
  constructor() {
    super();
    this.firestore = new Firestore;
    this.fireAuth = new FireAuth;
  }

  // Template
  static get template() {
    return html`
      <fire-auth user="{{user}}"></fire-auth>
    `;
  }

}

class Firestore {

  // Variables
  private firestore: firebase.firestore.Firestore;
  private fireStoreSettings = { timestampsInSnapshots: true };

  // Collections
  private someCollection: firebase.firestore.CollectionReference;
  private userCollection: firebase.firestore.CollectionReference;

  // Database user methods
  public setUser(userDb: UserDb) {
    const docRef = this.userCollection.doc(userDb.userId);
    // ToDo won't resolve offline???
    return docRef.set(userDb, { merge: true }).then(() => {
      return docRef.get().then(user => user.data() as UserDb);
    });
  }

  public getUser(userId: firebase.User['uid']) {
    return this.userCollection.doc(userId).get().then(user => {
      if (!user.exists) { return null; }
      return user.data() as UserDb;
    });
  }

  // Database document methods
  public addDocument(product: SomeDoc) {
    return this.someCollection.add(product).then(async docReference => {
      return {
        ref: docReference.id,
        data: await docReference.get().then(doc => doc.data())
      } as SomeDocRef;
    });
  }

  public getDocument(ref: string) {
    return this.someCollection.doc(ref).get().then(doc => {
      if (!doc.exists) { return undefined; }
      return {
        ref: doc.id,
        data: doc.data()
      } as SomeDocRef;
    });
  }

  public getAllProducts() {
    return this.someCollection.get().then(docs => {
      if (docs.empty) { return []; }
      const docArray: SomeDocRef[] = [];
      docs.forEach(doc => {
        docArray.push({
          ref: doc.id,
          data: doc.data() as SomeDoc,
        });
      });
      return docArray;
    });
  }

  public updateProduct(product: SomeDocRef) {
    const reference = this.someCollection.doc(product.ref);
    // TODO wont't resolve incase offline?
    return reference.update(product.data)
      .then(() => reference.get())
      .then(doc => {
        if (!doc.exists) { return undefined; }
        return {
          ref: doc.id,
          data: doc.data()
        } as SomeDocRef;
      });
  }

  // Private class methods
  private initializeFirestore() {
    this.firestore = firebase.firestore();
    this.firestore.settings(this.fireStoreSettings);
  }
  private defineCollections() {
    this.userCollection = this.firestore.collection('users');
    this.someCollection = this.firestore.collection('products');
  }

  // Life cycle
  constructor() {
    this.initializeFirestore();
    this.defineCollections();
  }

}

class FireAuth {

  // Variables
  public auth: firebase.auth.Auth;
  private googleProvider: firebase.auth.GoogleAuthProvider;
  private firestore: Firestore;

  // Public database methods
  public async loginGoogle() {
    return this.auth.signInWithPopup(this.googleProvider).then(async response => {
      if (!response.user) {
        return null;
      }
      const userLogin = response.user;
      const userDb = await this.firestore.getUser(userLogin.uid);

      this.firestore.setUser({
        userId: userLogin.uid,
        email: userLogin.email ? userLogin.email : '',
        username: userLogin.displayName ? userLogin.displayName : '',  // Do something with !username
        userType: userDb ? userDb.userType : 'user'
      });

      return this.firestore.getUser(userLogin.uid);
    }); // TODO Do something with errors
  }

  public async logout() {
    await this.auth.signOut();
    return null;
  }

  // Private class methods
  private initializeFireAuth() {
    this.auth = firebase.auth();
  }

  private defineProviders() {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      login_hint: 'user@TODO: AIR-LIQUIDE DOMAIN',
      prompt: 'select_account'
    });
  }

  // Life cycle
  constructor() {
    this.initializeFireAuth();
    this.defineProviders();

    this.firestore = new Firestore;
  }

}

// const testProduct = {
//   vibNr: '000000229456',
//   vibNaamBenelux: 'PerformaxTM CL1300',
//   versie: 1.7,
//   datum: new Date(),
//   vorige: new Date(),
//   bron: 'Solenis',
//   un: 1719,
//   properShippingNameNl: 'BIJTENDE ALKALISCHE VLOEISTOF, N.E.G. (KALIUMHYDROXIDE)',
//   properShippingNameFr: 'LIQUIDE ALCALIN CAUSTIQUE, N.S.A. (HYDROXYDE DE POTASSIUM)',
//   properShippingNameEn: '',
//   hNr: ['H290', 'H314', 'H317'],
//   pNr:
//     ['P261',
//       'P280',
//       'P301 + P330 + P331',
//       'P303 + P361 + P353',
//       'P304 + P340 + P310',
//       'P305 + P351 + P338 + P310'],
//   signalwordNl: 'Gevaar',
//   signalwordFr: 'Danger',
//   signalwordEn: '',
//   vibTeksNl: 'PerformaxTM CL1300',
//   vibTekstFr: 'PerformaxTM CL1300 TRAITEMENT DE SYSTÈMES FERMÉS',
//   vibTekstEn: '',
//   egNummer: '',
//   casNummer: '',
//   eNummerEn: '',
//   formule: '',
//   grenswaarde8uur: '',
//   grenswaarde15minuten: '',
//   noodnummer: ['00 800-7653-6471', '070 245 245'],
//   lc50: '',
//   cmrIndeling: '',
//   stofCategorie: 'LNR',
//   opmerkingSevesoIII: '',
//   sevesoIIIIndeling: [''],
//   klasseCmrTox: 4,
//   klasseFire: '',
//   klasseEnvironment: 4,
//   klasseIndelingNotes:
//     ['CMR class 3 because of H317',
//       'CMR class 4 because of H314',
//       'Environment class 4 because of H314',
//       'Environment class 4 because of H317'],
//   colourProduct: '',
//   odourProduct: '',
//   adrClp: ['ADR8', 'GHS05', 'GHS07'],
//   state: null,
//   mixOf: []
// };

// const test = new FirebaseService;
// const test2 = test.firestore.addProduct(testProduct).then(x => {
//   console.log(x);
// });

// const test3 = test.firestore.getAllProducts().then(x => {
//   console.log(x);
// });

// setTimeout(() => {
//   test.firestore.updateProduct({ ref: '5G7RjkMnMnWMkADf60y9', data: testProduct }).then(x => {
//     console.log(x);
//   });
// }, 2000);


// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if request.auth.token.email.split('@')[1] in get(/databases/$(database)/documents/authentication/acceptedDomains).data.domains;
//     }
//   }
// }
