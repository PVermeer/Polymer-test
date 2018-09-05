import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { config } from '../../../config';
import { SomeDoc, SomeDocRef, UserDb } from './types';
import { AddedDomain } from '../../../types/functions';

firebase.initializeApp(config.firebase);

const firebaseComponents = {
  fireAuth: firebase.auth(),
  firestore: firebase.firestore()
};

// Convert firebase observers to rxjs observable
firebaseComponents.fireAuth.onAuthStateChanged(async user => {
  if (!user) { firebaseService.fireAuth.user = null; return; }
  firebaseService.fireAuth.user = await firebaseService.firestore.getUser(user.uid);
});

class FirebaseService {

  // Public
  public firestore: Firestore;
  public fireAuth: FireAuth;

  // Life cycle
  constructor() {
    this.firestore = new Firestore(firebaseComponents.firestore);
    this.fireAuth = new FireAuth(firebaseComponents.fireAuth);
  }

}

class Firestore {

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

  public getAllDocuments() {
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

  public updateDocument(product: SomeDocRef) {
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
    this.firestore.settings({ timestampsInSnapshots: true });
  }
  private defineCollections() {
    this.userCollection = this.firestore.collection('users');
    this.someCollection = this.firestore.collection('documents');
  }
  private startup() {
    // Check if zzapps.nl is authorized in firestore.
    fetch(`${config.cloudfunctionsUrl}/domain`)
      .then(async response => {
        const body: AddedDomain = await response.json();
        if (body.addedDomain) { console.log('Added zzapps.nl to accepted domains in firestore'); }
        // Check for CORS
        if (body.cors) { console.warn('Cors is enabled server-side, keep that in mind :)'); }
      });
  }

  // Life cycle
  constructor(
    private firestore: firebase.firestore.Firestore
  ) {
    this.initializeFirestore();
    this.defineCollections();
    this.startup();
  }

}

class FireAuth {

  // Observable sources
  private userSource = new BehaviorSubject<UserDb | null>(null);

  // Observables
  public user$ = this.userSource.asObservable();

  public set user(user: UserDb | null) {
    this.userSource.next(user);
  }

  // Variables
  private googleProvider: firebase.auth.GoogleAuthProvider;

  // Public database methods
  public async loginGoogle() {
    return this.auth.signInWithPopup(this.googleProvider).then(async response => {
      if (!response.user) { return; }
      const userLogin = response.user;
      const userDb = await firebaseService.firestore.getUser(userLogin.uid);

      firebaseService.firestore.setUser({
        userId: userLogin.uid,
        email: userLogin.email ? userLogin.email : '',
        username: userLogin.displayName ? userLogin.displayName : '',  // Do something with !username
        userType: userDb ? userDb.userType : 'user'
      });

      const setUser = await firebaseService.firestore.getUser(userLogin.uid);
      this.userSource.next(setUser);
    }); // TODO Do something with errors
  }

  public async logout() {
    await this.auth.signOut();
    return null;
  }

  // Private class methods
  private defineProviders() {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      login_hint: 'user@TODO: AIR-LIQUIDE DOMAIN',
      prompt: 'select_account'
    });
  }

  // Life cycle
  constructor(
    private auth: firebase.auth.Auth
  ) {
    this.defineProviders();
  }

}

export const firebaseService = new FirebaseService;
