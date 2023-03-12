import { Component } from '@angular/core';
import { httpsCallableData, Functions } from '@angular/fire/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiLolService } from 'src/app/services/api-lol.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/data/en_US/profileicon.json
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/img/profileicon/20.png

  seIdConfirmation = httpsCallableData<any, any>(this.functions, 'setConfirmationLol');

  constructor(
    private lolService: ApiLolService,
    private userService: UserService,
    private auth: AuthService,
    private functions: Functions,
    private fb: FormBuilder
  ) {
  }

  form = this.fb.group({
    summonerName: ['', [Validators.required]],
  });

  async setConfirmationIdLol() {
    const user = await firstValueFrom(this.auth.user);    
    // await firstValueFrom(this.seIdConfirmation({idUser: "14304b67-373e-49c3-9efa-c3c4e244e9ed", summonerName: "flash inminente"}));
  }


}
