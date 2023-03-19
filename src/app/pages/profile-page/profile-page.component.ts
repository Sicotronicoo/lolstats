import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/data/en_US/profileicon.json
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/img/profileicon/21.png


  setIdConfirmationLol = httpsCallableFromURL<any, any>(this.functions, 'https://europe-west1-lolstats-71e8d.cloudfunctions.net/setIdConfirmationLol');
  confirmIdImgLol = httpsCallableFromURL<any, any>(this.functions, 'https://europe-west1-lolstats-71e8d.cloudfunctions.net/confirmIdImgLol');

  urlImg = "";
  imgIdLol = "";
  formNewAccount = false;
  summonerError = false;
  accountsUser!: any[];

  constructor(
    private fb: FormBuilder,
    private functions: Functions,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.getAccounts();
  }
  // console.log(`http://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idLolVerification}.png`);

  form = this.fb.group({
    summonerName: ['', [Validators.required]],
  });

  async getAccounts(){
    const user = await firstValueFrom(this.authService.user);    
    if(user){
      this.accountsUser = await this.userService.listAccountsByUser(user.uid);
    }
  }

  async setIdImgConfirmationLol() {
    this.summonerError = false;
    const user = await firstValueFrom(this.authService.user);    
    if (user) {
      const idImg = await this.setIdConfirmationLol({idUser: user.uid, summonerName: this.form.value.summonerName});      
      if(idImg.data !== null) {
        this.urlImg = `https://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idImg.data}.png`;
        this.imgIdLol = idImg.data.toString(); 
      } else {
        this.summonerError = true;
      }
    }   
  }

  async confirmIdImgLolVerification() {   
    const user = await firstValueFrom(this.authService.user);
    if (user) {
      const isVinculated = await this.confirmIdImgLol({summonerName: this.form.value.summonerName, userId: user.uid, idImg: this.imgIdLol});    
      if(isVinculated.data) {
        this.urlImg = "";
        this.imgIdLol = "";
        this.formNewAccount = false;
        this.accountsUser = await this.userService.listAccountsByUser(user.uid);
      } else {
        await this.setIdImgConfirmationLol();
      }  
    }                
  }

  isFormActive(){
    this.formNewAccount = true;
  }

}
