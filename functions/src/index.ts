/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as db from "./services/document.service";
import {confirmIdImgLolVerification, createIdImgVerification} from "./services/user.service";
import {getDataGames} from "./services/tournament.service";

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
      // setIdConfirmationLol({idUser: "hwxbYFaO7eYn6PVPhyg7GEiF7VF3", summonerName: "sico the tronico"},"")
      return await createIdImgVerification(data.summonerName, data.idUser);
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  });

export const confirmIdImgLol = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    try {/*
      if (!context.auth?.uid) {
        functions.logger.error("no token for user");
        throw new functions.https.HttpsError("failed-precondition", "no token for user");
      } */
      // confirmIdImgLol({summonerName: "sico the tronico", userId: "hwxbYFaO7eYn6PVPhyg7GEiF7VF3", idImg: "25"}, "")
      return await confirmIdImgLolVerification(data.summonerName, data.idImg, data.userId);
    } catch (e:any) {
      functions.logger.error(e);
      return e;
    }
  });

export const getDataGameTournamentsLol = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      // getDataGameTournamentsLol({""})
      await getDataGames("tournaments", "UaCHNfDDtZhXh0vlDsbk");
      return;
    } catch (e) {
      functions.logger.error(e);
      return;
    }
  });

export const test = functions.region("europe-west1")
  .https.onCall(async (data, context) => {
    try {
      functions.logger.info(data, "LLEGO");
      return;
    } catch (e) {
      functions.logger.error(e);
      return;
    }
  });


