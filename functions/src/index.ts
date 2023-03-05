import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as db from "./services/document.service";

admin.initializeApp();


export const createAuthUser = functions.region("europe-west1")
  .auth.user()
  .onCreate((user) =>
    db.setDoc("users", {
      id: user.displayName,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }).catch(functions.logger.error)
  );
