/* eslint-disable max-len */
import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;

const db = admin.firestore(admin.initializeApp({
  credential: admin.credential.applicationDefault(),
}, "appStats"));

export const setDoc = async (path: string, data: firestore.DocumentData): Promise<firestore.WriteResult> => {
  const dbData = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  return await db.collection(path).doc(data.id).set(dbData);
};
