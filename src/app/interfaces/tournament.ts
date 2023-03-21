import { BaseDocument } from "../services/document.service";

export interface Tournament extends BaseDocument{ 
    game: string | null,
    startDate:  string,
    endDate: string,
    name: string | null,
    award: string | null,
    public: boolean,
    players: any[] | null,
    winner: string | null,
    status: string | null,
}