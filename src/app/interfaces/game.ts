import { BaseDocument } from "../services/document.service";

export interface Game extends BaseDocument{
    gameId: number,
    dateGame: string,
    duration: number,
    players: any[],
    objetives: any[],
    bans: any[],
}