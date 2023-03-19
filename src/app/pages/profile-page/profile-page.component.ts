import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';

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

  idImgConfirmation: any;


  constructor(
    private fb: FormBuilder,
    private functions: Functions
  ) {
  }
  ///     // console.log(`http://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idLolVerification}.png`);

  form = this.fb.group({
    summonerName: ['flash inminente', [Validators.required]],
  });

  async setIdImgConfirmationLol() {
    const idImg = await this.setIdConfirmationLol({idUser: "hwxbYFaO7eYn6PVPhyg7GEiF7VF3", summonerName: "sico the tronico"});
    this.idImgConfirmation = idImg.data
    console.log(idImg.data);
  }

  async confirmIdImgLolVerification() {    
    console.log(this.idImgConfirmation);
        
    const test = await this.confirmIdImgLol({summonerName: "sico the tronico", userId: "hwxbYFaO7eYn6PVPhyg7GEiF7VF3", idImg: this.idImgConfirmation})
    console.log(test.data);
  }

}
