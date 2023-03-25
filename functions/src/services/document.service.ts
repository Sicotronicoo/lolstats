/* eslint-disable max-len */
import * as admin from "firebase-admin";
import {firestore} from "firebase-admin";
import {FieldValue} from "@google-cloud/firestore";
import {randomUUID} from "crypto";

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

export const generateId = () => {
  return randomUUID();
};

export const updateDoc = async (path: string, data: firestore.DocumentData): Promise<firestore.WriteResult> => {
  console.log(data);
  const dbData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  return await db.collection(path).doc(data.id).update(dbData);
};

export const createSubcollection = async (path: string, docId: string, data: firestore.DocumentData): Promise<firestore.DocumentReference<firestore.DocumentData>> => {
  const dbData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  return await db.collection(path).doc(docId).collection("accounts").add(dbData);
};

export const createSubSubcollection = async (path: string, docId: string, subPath: string, subDocId: string, subSubPath: string, data: firestore.DocumentData): Promise<firestore.DocumentReference<firestore.DocumentData>> => {
  const dbData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };
  return await db.collection(path).doc(docId).collection(subPath).doc(subDocId).collection(subSubPath).add(dbData);
};

export const deleteField = async (path: string, id: string, field: string) => {
  const userRef = db.collection(path).doc(id);
  await userRef.update({
    [field]: FieldValue.delete(),
  });
};
export const deleteDoc = (path: string): Promise<firestore.WriteResult> => db.doc(path).delete();
