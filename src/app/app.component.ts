import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import * as firebaseui from 'firebaseui';
import { Auth } from "@angular/fire/auth";
import firebase from "firebase/compat/app";
import { firstValueFrom, Subscription } from "rxjs"
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  private readonly ui: firebaseui.auth.AuthUI;
  private userServiceSubscription: Subscription | undefined;
  user$ = this.authService.user;
  menu = [
    { name: 'ADD GAME', route: 'add', icon: 'card_travel' },
    { name: 'TORUNAMENTS', route: 'tournaments', icon: 'card_travel' },

  ];
  usuerStatus!: Boolean;
  isSingUp: Boolean = false;
  form = this.fb.group({
    userName: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(
    public auth: Auth,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.isLogin();
    this.ui = new firebaseui.auth.AuthUI(auth);
  }

  ngOnInit(): void {
    const uiConfig: firebaseui.auth.Config = {
      signInFlow: 'popup',
      signInSuccessUrl: '/profile',
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          authMethod: 'https://accounts.google.com',

        },
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    };
    this.ui.disableAutoSignIn();
    this.ui.start('#firebaseui-auth-container', uiConfig);
  }

  isLoginInterface(value: string) {
    if (value === "login") {
      window.location.replace("http://localhost:4200/");
    } else {
      this.isSingUp = true;
    }
  }

  async login() {
    if (this.form.value.userName && this.form.value.password) {
      const credentials = await this.authService.signInEmailAndPassword(this.form.value.userName, this.form.value.password);
      if (typeof credentials === 'object') {
        this.usuerStatus = true;
        this.authService.setCurrentUser(true);
        this.router.navigate(['/profile']);
      }
    }
  }

  async signUp() {
    if (this.form.value.userName && this.form.value.password) {
      const credentials = await this.authService.loginEmail(this.form.value.userName, this.form.value.password);
      if (typeof credentials === 'object')
        this.usuerStatus = true;
      this.authService.setCurrentUser(true);
      this.router.navigate(['/profile']);
    }
  }

  async isLogin() {
    const isLogin = await firstValueFrom(this.authService.uid);
    if (isLogin) {
      this.authService.setCurrentUser(isLogin);
      this.userServiceSubscription = this.authService.currentUser.subscribe(currentUser => {
        this.usuerStatus = currentUser;
      });
    }
  }

  signOut() {
    this.authService.setCurrentUser(false);
    return this.authService.signOut();
  }

  ngOnDestroy(): void {
    this.userServiceSubscription?.unsubscribe();
    this.ui.delete().then();
  }
}
