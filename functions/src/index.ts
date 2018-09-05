import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import { AcceptedDomains, AddedDomain } from '../../src/types/functions';

const app = express();

// Firebase
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

let cors = false;

// ------------- Express --------------

//Middleware
app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  cors = true;
  next();
});

// Routes
app.get("/domain", setDomain);

// Export firebase function as whole. Request are set on main/<route>
export const main = functions.https.onRequest(app);

// Functions
async function setDomain(_req: express.Request, res: express.Response) {

  // Setup acceptedDomains in firestore if it doesn exist yet
  const acceptedDomains = firestore.collection('authentication').doc('acceptedDomains');
  return acceptedDomains.get().then(async doc => {
    if (!doc.exists) {
      await acceptedDomains.set({ domains: ['zzapps.nl'] } as AcceptedDomains, { merge: true });
      return res.json({ addedDomain: true, cors } as AddedDomain);
    }
    return res.json({ addedDomain: false, cors } as AddedDomain);
  });
}
