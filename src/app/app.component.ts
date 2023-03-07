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
  menu = [
    { name: 'last games', route: '/games', icon: 'assignment_ind' },
    { name: 'ranking', route: '', icon: 'card_travel' },
    { name: 'add game', route: '/add', icon: 'sentiment_very_satisfied'},
    { name: 'profile', route: '/profile', icon: 'sentiment_very_satisfied'},
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
      signInSuccessUrl: '/',
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
        this.router.navigate(['/']);
      }
    }
  }

  async signUp() {
    if (this.form.value.userName && this.form.value.password) {
      const credentials = await this.authService.loginEmail(this.form.value.userName, this.form.value.password);
      if (typeof credentials === 'object')
        this.usuerStatus = true;
      this.authService.setCurrentUser(true);
      this.router.navigate(['/']);
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
  ngOnDestroy(): void {
    this.userServiceSubscription?.unsubscribe();
    this.ui.delete().then();
  }
}
