import { Injectable } from '@angular/core';
import {Auth, User} from "@angular/fire/auth";

import { authState } from '@angular/fire/auth';
import { map, firstValueFrom, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  )

  constructor(
    private auth: Auth,
    private router: Router,
  ) { 
  }

  setCurrentUser(currentUser: Boolean): void {    
    this.auth.config

    this.currentUserSubject.next(currentUser);
  }

  async signOut() {
    await this.auth.signOut();
    return await this.router.navigate(['']);
  }

}
