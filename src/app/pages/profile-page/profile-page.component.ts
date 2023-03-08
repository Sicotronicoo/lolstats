import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiLolService } from 'src/app/services/api-lol.service';

const KEY = "RGAPI-e15effc1-4181-4928-9863-694e370fff9f";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/data/en_US/profileicon.json
  // https://ddragon.leagueoflegends.com/cdn/13.4.1/img/profileicon/588.png

  constructor(
    private lolService: ApiLolService
  ) {
  }

  async test() {
    const player = await firstValueFrom(this.lolService.getPuuidPlayer("flash inminente", KEY));
    console.log(player);
    const test = await firstValueFrom(this.lolService.test());
    console.log(test);
  }

}
