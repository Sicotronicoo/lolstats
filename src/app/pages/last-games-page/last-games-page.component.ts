import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {ApiLolService} from "../../services/api-lol.service"

@Component({
  selector: 'app-last-games-page',
  templateUrl: './last-games-page.component.html',
  styleUrls: ['./last-games-page.component.scss']
})
export class LastGamesPageComponent {

  constructor (
    private auth: AuthService,
  ) {
  }

  async signout(){
    this.auth.setCurrentUser(false);
    await this.auth.signOut()
  }
}
