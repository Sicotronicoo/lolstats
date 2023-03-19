import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private functions: Functions,
    private authService: AuthService
  ) {
  }
  ///     // console.log(`http://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idLolVerification}.png`);

  form = this.fb.group({
    summonerName: ['', [Validators.required]],
  });

  isFormActive(){
    this.formNewAccount = true;
  }

  async setIdImgConfirmationLol() {
    const user = await firstValueFrom(this.authService.user);
    if (user) {
      const idImg = await this.setIdConfirmationLol({idUser: user.uid, summonerName: this.form.value.summonerName});
      this.urlImg = `https://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idImg.data}.png`;
      this.imgIdLol = idImg.data.toString(); 
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
      } else {
        await this.setIdImgConfirmationLol();
      }  
    }                
  }

}
