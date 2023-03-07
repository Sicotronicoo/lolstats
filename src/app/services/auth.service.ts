import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "@angular/fire/auth";

import { authState } from '@angular/fire/auth';
import { map, BehaviorSubject, Observable } from 'rxjs';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  public readonly currentUser: Observable<Boolean> = this.currentUserSubject.asObservable();

  user = authState(this.auth);
  uid = this.user.pipe(
    map(user => {
      if (!user) {
        return false;
      }
      return true;
    })
  );

  constructor(
    private auth: Auth,
    private documentService: DocumentService
  ) {
  }

  async signInEmailAndPassword(email: string, password: string) {
    try {
      const credentials = await signInWithEmailAndPassword(getAuth(), email, password);
      console.log(credentials);
    } catch (error) {
      console.log(error);
    }
  }

  async loginEmail(email: string, password: string){
    try {
      const credentials = await createUserWithEmailAndPassword(getAuth(), email, password);
      if(credentials){
        const user = {
          displayName: null,
          email,
          photoURL: "",
        };
        await sendEmailVerification(credentials.user);
        await this.documentService.create('users', user);
        return credentials;
      }
      return null;
    } catch (error) {
      return window.location.replace("http://localhost:4200/");
    }
  }

  setCurrentUser(currentUser: Boolean): void {
    this.currentUserSubject.next(currentUser);
  }

  async signOut() {
    await this.auth.signOut();
    window.location.replace("http://localhost:4200/");
  }

}
