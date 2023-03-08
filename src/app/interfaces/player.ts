import { BaseDocument } from "../services/document.service";
import { Game } from "./game";

export interface Player extends BaseDocument{
    name: string,
    wins: number,
    loss: number,
    id: string,
    kda: number,
    firstBlood: number,
    kills: number,
    deaths: number,
    assists: number,
    doubleKills: number,
    tripleKills: number,
    quadraKills: number,
    pentakills: number,
    games: Game[],
    champions: [{
        championId: number,
        championName: number,
        wins: number,
        loss: number,
        kills: number,
        assists: number,
        deaths: number,
        kda: number,
    }],
    possitions:[{
        possition: string,
        wins: number,
        loss: number,
    }],
    totalDamage: number,
    totalMinions: number,
    totalVisionPoints: number,
}