/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as db from "./services/document.service";
import {confirmIdImgVerification, createIdImgVerification} from "./services/user.service";

admin.initializeApp();


export const createAuthUser = functions.region("europe-west1")
  .auth.user()
  .onCreate((user) =>
    db.setDoc("users", {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }).catch(functions.logger.error)
  );


export const deleteAuthUser = functions.region("europe-west1")
  .auth.user()
  .onDelete((user) =>
    db.deleteDoc("users/" + user.uid).catch(functions.logger.error));

export const setIdConfirmationLol = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    try {/*
      if (!context.auth?.uid) {
        functions.logger.error("no token for user");
        throw new functions.https.HttpsError("failed-precondition", "no token for user");
      } */
      // setIdConfirmationLol({idUser: "tjF1V5kP9FXPJG43ux5TAWxSW7x1", summonerName: "flash inminente"},"")
      console.log(data.summonerName, data.idUser);
      await createIdImgVerification(data.summonerName, data.idUser);
      return;
    } catch (e) {
      functions.logger.error(e);
      return;
    }
  });

export const confirmIdImgLol = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    try {/*
      if (!context.auth?.uid) {
        functions.logger.error("no token for user");
        throw new functions.https.HttpsError("failed-precondition", "no token for user");
      } */
      // confirmIdImgLol({summonerName: "flash inminente", userId: "tjF1V5kP9FXPJG43ux5TAWxSW7x1", idImg: "20"}, "")
      const idImg = await confirmIdImgVerification(data.summonerName, data.idImg, data.userId);
      console.log(idImg);
      return;
    } catch (e) {
      functions.logger.error(e);
      return;
    }
  });
