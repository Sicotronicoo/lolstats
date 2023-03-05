import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiLolService } from 'src/app/services/api-lol.service';
import { firstValueFrom } from 'rxjs';
import { Game } from 'src/app/interfaces/game';
import { Player } from 'src/app/interfaces/player';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-stats-page',
  templateUrl: './add-stats-page.component.html',
  styleUrls: ['./add-stats-page.component.scss']
})
export class AddStatsPageComponent {

  game!: Game;

  constructor(
    private apiLol: ApiLolService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,

  ) {

  }

  form = this.fb.group({
    gameId: ["", Validators.required]
  })

  async getGameStats() {
    console.log("Hola");
    
   /*  const tes = await firstValueFrom(this.apiLol.getListGameIds("NEzMyDmOisZMnvdvllbPhw4WFmWUvHSgpfDLJdGC_zJWZ1Do5839pozl3Euj5A7T01b1yY2eq1DSww","RGAPI-edbc03ed-694b-44b3-9170-32675ae6f84f"));
    console.log(tes); */
    
    
    // 6285426627 game real
    // 6285670770 game personalizada 
    // 6293521707
    if (this.form.value.gameId) {
      const dataGame = await firstValueFrom(this.apiLol.getGameStats(`EUW1_6293521707`, "RGAPI-edbc03ed-694b-44b3-9170-32675ae6f84f")); 
      console.log(dataGame);
      const exists = await this.apiLol.gameExists(this.form.value.gameId);
      if(!exists){
        const game = this.fillContainerGame(dataGame);
        await this.setStatsPlayerByGame(game as Game);
        await this.apiLol.saveGame(game as Game);
      } else {
        this.snackBar.open("Game already registred", 'close');
      }
    }
  }

  fillContainerGame(game: any){
    const players: any[] = [];
    const bans: any[] = [];
    const objetives: any [] = [];
    for (let k = 0; k < game.info.participants.length; k++) {
      players.push({         
        assists: game.info.participants[k].assists,
        champion: game.info.participants[k].championId,
        championLevel: game.info.participants[k].champLevel,
        championName: game.info.participants[k].championName,
        individualPosition: game.info.participants[k].individualPosition,
        damage: game.info.participants[k].totalDamageDealtToChampions,
        deaths: game.info.participants[k].deaths,
        gold: game.info.participants[k].goldEarned,
        id: game.info.participants[k].puuid,
        items: [
          game.info.participants[k].item0,
          game.info.participants[k].item1,
          game.info.participants[k].item2,
          game.info.participants[k].item3,
          game.info.participants[k].item4,
          game.info.participants[k].item5,
          game.info.participants[k].item6,
        ],
        firstBloodKill: game.info.participants[k].firstBloodKill,
        kills: game.info.participants[k].kills,
        doubleKills: game.info.participants[k].doubleKills,
        tripleKills: game.info.participants[k].tripleKills,
        quadraKills: game.info.participants[k].quadraKills,
        pentaKills: game.info.participants[k].pentaKills,
        minions: game.info.participants[k].totalMinionsKilled,
        name: game.info.participants[k].summonerName,
        sumonners: [
          game.info.participants[k].summoner1Id,
          game.info.participants[k].summoner2Id
        ],
        team: game.info.participants[k].teamId,
        win: game.info.participants[k].win,
        visionScore: game.info.participants[k].visionScore
      });
    }
    for (let i = 0; i < game.info.teams.length; i++) {
      objetives.push({
        team: game.info.teams[i].teamId,
        drakes: game.info.teams[i].objectives.dragon.kills,
        heralds: game.info.teams[i].objectives.riftHerald.kills,
        inhibitors: game.info.teams[i].objectives.inhibitor.kills,
        nashors: game.info.teams[i].objectives.baron.kills,
        towersDestroy: game.info.teams[i].objectives.tower.kills,
        win: game.info.teams[i].win,
      });
      for (let j = 0; j < game.info.teams[i].bans.length; j++) {
        bans.push({banId: game.info.teams[i].bans[j].championId, team: game.info.teams[i].teamId});
      }        
    }
    const newGame = {
      gameId: game.info.gameId,
      dateGame: new Date(game.info.gameCreation).toUTCString(),
      duration: game.info.gameDuration,
      players,
      objetives,
      bans,
    };        
    return newGame;
  }

  async setStatsPlayerByGame(game: Game){    
    for (let i = 0; i < game.players.length; i++) {
      let player: Player = {} as Player;      
      this.apiLol.playerExists(game.players[i].id).then(async (exists) => {        
        if(!exists){
          player = {
            assists: game.players[i].assists,
            champions: [{
              assists: game.players[i].assists,
              championId: game.players[i].champion,
              championName: game.players[i].championName,
              deaths: game.players[i].deaths,
              kda: (game.players[i].kills + game.players[i].assists) / game.players[i].deaths,
              kills: game.players[i].kills,
              loss: game.players[i].win === false ? 1 : 0,
              wins: game.players[i].win === true ? 1 : 0,
            }],
            deaths: game.players[i].deaths,
            doubleKills: game.players[i].doubleKills,
            firstBlood: game.players[i].firstBloodKill === true ? 1 : 0,
            games: [game],
            id: game.players[i].id,
            kda: (game.players[i].kills + game.players[i].assists) / game.players[i].deaths,
            kills: game.players[i].kills,
            loss: game.players[i].win === false ? 1 : 0,
            name: game.players[i].name,
            pentakills: game.players[i].pentaKills,
            possitions: [{
              loss: game.players[i].win === false ? 1 : 0,
              possition: game.players[i].individualPosition,
              wins: game.players[i].win === true ? 1 : 0,
            }],
            quadraKills: game.players[i].quadraKills,
            totalDamage: game.players[i].damage,
            totalMinions: game.players[i].minions,
            totalVisionPoints: game.players[i].visionScore,
            tripleKills: game.players[i].tripleKills,
            wins: game.players[i].win === true ? 1 : 0,
          } as Player;
          await this.apiLol.savePlayer(player);
        } else {
          let champion: any = [];
          let possition: any = [];
          const playerData = await firstValueFrom(this.apiLol.getInfoPlayer(game.players[i].id));
          const searchChampion = playerData.champions.find((champ) => champ.championId === game.players[i].champion);
          if (searchChampion !== undefined){
            const index = playerData.champions.findIndex((champion) => champion.championId === game.players[i].champion);
            playerData.champions.splice(index, 1);
            champion.push({
              assists: searchChampion.assists + game.players[i].assists,
              championId: game.players[i].champion,
              championName: game.players[i].championName,
              deaths: searchChampion.deaths + game.players[i].deaths,
              kda: (searchChampion.assists + game.players[i].assists + searchChampion.kills + game.players[i].kills) / (searchChampion.kills + game.players[i].kills),
              kills: searchChampion.kills + game.players[i].kills,
              loss: (game.players[i].win === false ? 1 : 0) + searchChampion.loss,
              wins: (game.players[i].win === true ? 1 : 0) + searchChampion.wins,
            });
          } else {
            champion.push({
              assists: game.players[i].assists,
              championId: game.players[i].champion,
              championName: game.players[i].championName,
              deaths: game.players[i].deaths,
              kda: (game.players[i].kills + game.players[i].assists) / game.players[i].deaths,
              kills: game.players[i].kills,
              loss: game.players[i].win === false ? 1 : 0,
              wins: game.players[i].win === true ? 1 : 0,
            })
          }
          const searchPossition = playerData.possitions.find((possition) => possition.possition === game.players[i].individualPosition);
          if (searchPossition !== undefined ) {
            const index = playerData.possitions.findIndex((possition) => possition.possition === game.players[i].individualPosition);
            playerData.possitions.splice(index, 1);
            possition.push({
              loss: (game.players[i].win === false ? 1 : 0) + playerData.loss,
              possition: game.players[i].individualPosition,
              wins: (game.players[i].win === true ? 1 : 0) + playerData.wins,
            });
          } else {
            possition.push({
              loss: game.players[i].win === false ? 1 : 0,
              possition: game.players[i].individualPosition,
              wins: game.players[i].win === true ? 1 : 0,
            });
          }
          player = {
            assists: game.players[i].assists + playerData.assists,
            champions: champion,
            deaths: game.players[i].deaths + playerData.deaths,
            doubleKills: game.players[i].doubleKills + playerData.doubleKills,
            firstBlood: game.players[i].firstBloodKill === true ? 1 : 0 + playerData.firstBlood,
            games: [...playerData.games, game],
            id: game.players[i].id,
            kda: (game.players[i].kills + game.players[i].assists + playerData.kills + playerData.assists) / (game.players[i].deaths + playerData.deaths),
            kills: game.players[i].kills + playerData.kills,
            loss: (game.players[i].win === false ? 1 : 0) + playerData.loss,
            name: game.players[i].name,
            pentakills: game.players[i].pentaKills + playerData.pentakills,
            possitions: possition,
            quadraKills: game.players[i].quadraKills + playerData.pentakills,
            totalDamage: game.players[i].damage + playerData.totalDamage,
            totalVisionPoints: game.players[i].visionScore + playerData.totalVisionPoints,
            totalMinions: game.players[i].minions +playerData.totalMinions,
            tripleKills: game.players[i].tripleKills + playerData.tripleKills,
            wins: (game.players[i].win === true ? 1 : 0) + playerData.wins,
          } as Player;
          await this.apiLol.updatePlayer(player);
        }
      });
    }
  }
}
