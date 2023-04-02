import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Game } from '../interfaces/game';
import { Player } from '../interfaces/player';
import { DocumentService } from './document.service';


const KEY = "RGAPI-0490da03-2b4b-4217-b144-ce45c05486dd";


@Injectable({
  providedIn: 'root'
})
export class ApiLolService {

  constructor(
    private http: HttpClient,
    private documentService: DocumentService,
    private snackbar: MatSnackBar
  ) { }

  async saveGame(game: Game): Promise<DocumentReference<DocumentData>> {
    const doc = await this.documentService.create('games', game);
    this.snackbar.open('Stats of game: ' + game.gameId + " saved.", 'close');
    return doc;
  }

  async savePlayer(player: Player): Promise<DocumentReference<DocumentData>> {
    const doc = await this.documentService.create('players', player);
    this.snackbar.open('Player: ' + player.name + " added in to data base.", 'close');
    return doc;
  }

  async updatePlayer(player: Player): Promise<void> {
    const doc = await this.documentService.update('players', player);
    this.snackbar.open('Player: : ' + player.name + " has been update.", 'close');
    return doc;
  }

  getInfoPlayer(puuid: string) {
    return this.documentService.get<Player>(`players/${puuid}`);
  }
  
  playerExists(puuid: string){
    return this.documentService.profileExists("players", "id", puuid);
  }

  gameExists(idGame: string){
    return this.documentService.profileExists("games", "gameId", idGame);
  }

  getPuuidPlayer(summonerName: string) {
    return this.http.get<any>(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName.replaceAll(" ", "%20")}?api_key=${KEY}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }
    }).pipe(retry(1), catchError(this.handleError));
  }

  getGameStats(idGame: string) {
    return this.http.get<any>(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${idGame}?api_key=${KEY}`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }
    }).pipe(retry(1), catchError(this.handleError));
  }

  getListGameIds(puuid: string) {
    return this.http.get(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=RGAPI-7e26b1dc-a02a-4fc0-aac5-3195a047ed52`, {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }
    }).pipe(retry(1), catchError(this.handleError));
  }


  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
