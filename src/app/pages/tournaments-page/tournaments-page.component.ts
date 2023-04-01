import { Component, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tournament } from 'src/app/interfaces/tournament';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';

import { TournamentService } from 'src/app/services/tournament.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLolService } from 'src/app/services/api-lol.service';

@Component({
  selector: 'app-tournaments-page',
  templateUrl: './tournaments-page.component.html',
  styleUrls: ['./tournaments-page.component.scss']
})
export class TournamentsPageComponent {

  inscription: boolean = false;
  accounts!: any;
  accountForInscribe = "";
  activeTournaments$!: Observable<Tournament[]>;
  activeTournaments: Tournament[] = [];
  tournamentPlayers: any[] = [];
  showTournamentPlayers: boolean = false;
  newTournament: boolean = false;
  form = this.fb.group({
    game: ['', [Validators.required]],
    name: ['', [Validators.required]],
    startDate:  ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    award: ['', [Validators.required]],
    public: [true, [Validators.required]],
    active: [true]
  });

  constructor (
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiLol: ApiLolService,
  ) {
    this.getTournaments();
   /* (async () => {
    const gameInfo = await firstValueFrom(this.apiLol.getGameStats(`EUW1_6334869653`)); 
    console.log(gameInfo);
    const tets = await firstValueFrom(this.documentService.list<any>("/tournaments/UaCHNfDDtZhXh0vlDsbk/participants"));
    console.log(tets);
    
    
   })() */
  }

  async saveTournament(){
    const tournament = {
      ...this.form.value,
      players: null,
      winner: null,
      status: "open",    
    }
    await this.tournamentService.createTournament(tournament as Tournament);
    this.newTournament = false;
  }

  async getTournaments() {
    this.activeTournaments$ = this.tournamentService.listActiveTournaments().pipe(
      tap((tournaments) => {
        this.activeTournaments = tournaments;
      })
    );
    this.accounts = await this.getAccounts()
  }

  createTournament() {  
    if (this.newTournament) {
      this.newTournament = false;
    } else {
      this.newTournament = true;
    }
  }

  async getAccounts(){
    const user = await firstValueFrom(this.authService.user);
    if (user) {
      return await this.userService.listAccountsByGame(user.uid);
    }
    return null;
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
      await this.tournamentService.addPlayerInTournament(tournamentId, {id: this.accounts[index].puuid, name: this.accounts[index].name, games: null, points: null, wins: 0, losses: 0});
      if (tournament.players === null){
        let players: string[] = [this.accounts[index].puuid];
        await this.tournamentService.setPlayerIntournament(tournamentId, players);
      } else {
        const tournament = await firstValueFrom(this.tournamentService.getInfoTournament(tournamentId));
        if (tournament.players) {          
          let players: string[] = tournament.players;
          players.push(this.accounts[index].puuid);
          await this.tournamentService.setPlayerIntournament(tournamentId, players);
          }
      }
    } else {
      this.snackBar.open(`${this.accounts[index].name} already registered for this tournament.`, 'close');
    }
 }

 async openRanking(tournamentId: string) {
  if(this.showTournamentPlayers){
    const index = this.tournamentPlayers.findIndex((tournament: any) => tournament.tournamentId === tournamentId);
    this.tournamentPlayers = [];
    if(index !== -1){
      this.showTournamentPlayers = false;
    } else {
      this.tournamentPlayers.push({tournamentId: tournamentId, participants: await this.tournamentService.listPlayersTournament(tournamentId)});
    }
  } else {
    this.showTournamentPlayers = true;
    this.tournamentPlayers.push({tournamentId: tournamentId, participants: await this.tournamentService.listPlayersTournament(tournamentId)});
  }  
  console.log(this.tournamentPlayers);
}

}
