import { Injectable } from '@angular/core';
import {
  Firestore,
  docData, collectionData,
  Timestamp, DocumentReference, Transaction,
  collection, doc, updateDoc, setDoc, deleteDoc, query, QueryConstraint,
  serverTimestamp, collectionGroup,
} from "@angular/fire/firestore";
import { firstValueFrom, Observable } from "rxjs";
import { DocumentData } from "rxfire/firestore/interfaces";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getDocs, where } from 'firebase/firestore';

export interface BaseDocument {
  readonly id: string
  readonly createdAt: Timestamp
  readonly updatedAt: Timestamp
}

interface Data {
  [x: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private db: Firestore,
    private snackBar: MatSnackBar,
  ) {
  }

  createId(path: string) {
    return doc(collection(this.db, path)).id;
  }

  list<T>(path: string, queryConstraint: QueryConstraint[] = []) {
    try {
      return collectionData(query(collection(this.db, path), ...queryConstraint)) as Observable<T[]>;
    } catch (e) {
      this.error('Error al listar los documentos')
      throw e;
    }
  }

  listP<T>(path: string, queryConstraint: QueryConstraint[] = []) {
    try {
      return firstValueFrom(collectionData(query(collection(this.db, path), ...queryConstraint))) as Promise<T[]>;
    } catch (e) {
      this.error('Error al listar los documentos')
      throw e;
    }
  }

  listGroup<T>(path: string, queryConstraint: QueryConstraint[] = []) {
    try {
      return collectionData(query(collectionGroup(this.db, path), ...queryConstraint)) as Observable<T[]>;
    } catch (e) {
      this.error('Error al listar los documentos')
      throw e;
    }
  }

  listGroupP<T>(path: string, queryConstraint: QueryConstraint[] = []) {
    try {
      return firstValueFrom(collectionData(query(collectionGroup(this.db, path), ...queryConstraint))) as Promise<T[]>;
    } catch (e) {
      this.error('Error al listar los documentos')
      throw e;
    }
  }

  get<T>(path: string): Observable<T>
  get<T>(path: string, transaction: Transaction): Promise<T>
  get<T>(path: string, transaction?: Transaction) {
    try {
      const docRef = doc(this.db, path);

      return transaction ? transaction.get(docRef) : docData(docRef) as Observable<T>
    } catch (e) {
      this.error('Error al obtener el documento')
      throw e;
    }
  }


  create(path: string, data: Data): Promise<DocumentReference<DocumentData>>
  create(path: string, data: Data, transaction: Transaction): Transaction
  create(path: string, data: Data, transaction?: Transaction) {
    try {
      const id = data["id"] ? data["id"] : this.createId(path);
      const dbData = {
        ...data,
        id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = doc(this.db, path, id);

      if (transaction) {
        return transaction.set(docRef, dbData);
      } else {
        return new Promise<DocumentReference<DocumentData>>(async (resolve) => {
          await setDoc(docRef, dbData)
          resolve(docRef);
        });
      }
    } catch (e) {
      this.error()
      throw e;
    }
  }

  set(path: string, data: Data): Promise<void>
  set(path: string, data: Data, transaction: Transaction): Transaction
  set(path: string, data: Data, transaction?: Transaction) {
    try {
      data["createdAt"] = serverTimestamp();
      data["updatedAt"] = serverTimestamp();

      const docRef = doc(this.db, path, data["id"]);

      console.log(`setting document ${path}`, data);
      return transaction ? transaction.set(docRef, data) : setDoc(docRef, data);
    } catch (e) {
      this.error()
      throw e;
    }
  }

  update(path: string, data: Data): Promise<void>
  update(path: string, data: Data, transaction: Transaction): Transaction
  update(path: string, data: Data, transaction?: Transaction) {
    try {
      data["updatedAt"] = serverTimestamp();
      const docRef = doc(this.db, path, data['id']);
      console.log(`updating document ${path}`, data)
      return transaction ? transaction.update(docRef, data) : updateDoc(docRef, data);
    } catch (e) {
      this.error()
      throw e;
    }
  }

  delete(path: string, data: Data): Promise<void>
  delete(path: string, data: Data, transaction: Transaction): Transaction
  delete(path: string, data: Data, transaction?: Transaction) {
    try {
      const docRef = doc(this.db, path, data['id']);
      console.log(`deleting document ${path}`, data)
      return transaction ? transaction.delete(docRef) : deleteDoc(docRef);
    } catch (e) {
      this.error('Error al borrar el documento')
      throw e;
    }
  }

  async profileExists(coll: string, attribute: string, value: string) {
    const exists = await getDocs(query(collection(this.db, coll), where(attribute, "==", value)));
    if (exists.size > 0) {
      return true;
    } else {
      return false;
    }
  }

  private error(message = 'Error al guardar el documento') {
    this.snackBar.open(message, 'cerrar');
  }

}
