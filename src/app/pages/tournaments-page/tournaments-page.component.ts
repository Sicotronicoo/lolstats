import { Component, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tournament } from 'src/app/interfaces/tournament';
import { AuthService } from 'src/app/services/auth.service';
import { TournamentService } from 'src/app/services/tournament.service';
import { UserService } from 'src/app/services/user.service';
import { firstValueFrom } from 'rxjs';
import { SelectionChange } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tournaments-page',
  templateUrl: './tournaments-page.component.html',
  styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent {

  inscription: boolean = false;
  accounts!: any;
  accountForInscribe = "";

  form = this.fb.group({
    game: ['', [Validators.required]],
    name: ['', [Validators.required]],
    startDate:  ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    award: ['', [Validators.required]],
    public: [true, [Validators.required]],
  });

  constructor (
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {

  }

  async saveTournament(){
    const tournament = {
      ...this.form.value,
      players: null,
      winner: null,
      status: "open",    
    }
    await this.tournamentService.createTournament(tournament as Tournament);
  }

  async getAccounts(){
    const user = await firstValueFrom(this.authService.user);
    if (user) {
      return await this.userService.listAccountsByGame(user.uid);
    }
    return null;
  }

  async inscribeInTournament(){
    this.accounts= await this.getAccounts();    
    if(this.accounts !== null){
      this.inscription = true;
      this.accountForInscribe = this.accounts[0].name;
    }
  }

  selectAccount(event: any) {        
   this.accountForInscribe = event.target.value;
  }

  async joinInTournament(tournamentId: string){    
    const index = this.accounts.findIndex((account: any) => {
      return account.name === this.accountForInscribe;
    });       
    const isAlreadyRegistred = await this.tournamentService.playerAlreadyRegistred(tournamentId, this.accounts[index].puuid);
    const tournament = await firstValueFrom(this.tournamentService.getInfoTournament(tournamentId));    
    if(!isAlreadyRegistred) {
      await this.tournamentService.addPlayerInTournament(tournamentId, {id: this.accounts[index].puuid, name: this.accounts[index].name, games: null});
      if (tournament.players === null){
        let players: string[] = [this.accounts[index].puuid];
        await this.tournamentService.setPlayerIntournament(tournamentId, players);
      } else {
        const tournament = await firstValueFrom(this.tournamentService.getInfoTournament(tournamentId));
        if (tournament.players) {
          let players: string[] = tournament.players;
          await this.tournamentService.setPlayerIntournament(tournamentId, players);
          }
      }
    } else {
      this.snackBar.open(`${this.accounts[index].name} already registered for this tournament.`, 'close');
    }
 }

}
