import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Tournament } from '../interfaces/tournament';
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
  ) { }

  async createTournament(data: Tournament){
    await this.documentService.create("tournaments", data);
    this.snackBar.open(`Tournament ${data.name} has been created.`, 'close');
  }

  async addPlayerInTournament(torunamentId: string, player: any){
    await this.documentService.create(`tournaments/${torunamentId}/participants`, player);
    this.snackBar.open(`${player.name} registered for the tournament.`, 'close');
  }

  getInfoTournament(idTournament: string) {
    return this.documentService.get<Tournament>(`tournaments/${idTournament}`);
  }

  setPlayerIntournament(idTournament: string, data: string[]){
    return this.documentService.set(`tournaments/`, {id: idTournament, players: data});
  }


  async playerAlreadyRegistred(idTournament: string, idPlayer: string){
    const participant = await firstValueFrom(this.documentService.get<any>(`tournaments/${idTournament}/participants/${idPlayer}`));    
    if(participant){      
      return true;
    } else {      
      return false;
    }   
  }
}
