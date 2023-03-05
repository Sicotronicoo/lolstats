import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import * as firebaseui from 'firebaseui';
import {Auth} from "@angular/fire/auth";
import firebase from "firebase/compat/app";
import {firstValueFrom, Subscription} from "rxjs"
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy{
  private readonly ui: firebaseui.auth.AuthUI;
  private userServiceSubscription: Subscription | undefined;
  usuerStatus!: Boolean;

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })
  
  passwordValid: any[] = [
    {value: this.form.controls.password.valid, name: "password"},
    {value: this.form.controls.userName.valid, name: "userName"},
  ];

  constructor(
    public auth: Auth,
    private authService: AuthService,
    private fb: FormBuilder
    ) {
      this.isLogin();
      this.ui = new firebaseui.auth.AuthUI(auth);
  }

  ngOnInit(): void {    
    const uiConfig: firebaseui.auth.Config = {
      signInFlow: 'popup',
      signInSuccessUrl: '/games',
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

    
    const uiFirebaseConfig: firebaseui.auth.Config = {
      signInSuccessUrl: '/games',
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          authMethod: "",

        },
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    };
   /*  this.ui.disableAutoSignIn();
    this.ui.start('#email-auth-container', uiFirebaseConfig); */
  }

  login(){
    console.log("hola");
    
  }

  async isLogin() {
    const isLogin = await firstValueFrom(this.authService.uid);
    if(isLogin){
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

  menu = [
    { name: 'last games', route: '/games', icon: 'assignment_ind' },
    {name: 'ranking', route: '', icon: 'card_travel'},
    { name: 'add game', route: '/add', icon: 'sentiment_very_satisfied' },
  ];

}
