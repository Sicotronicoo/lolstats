/* eslint-disable max-len */
import * as axios from "axios";
import {createSubSubcollection} from "./document.service";
/* import * as db from "../services/document.service";
import * as functions from "firebase-functions"; */

const apiKey = JSON.parse(process.env.API_LOL ? process.env.API_LOL : "{}");

const lastLolGamesPlayer = async (puuid: string, startDate?: EpochTimeStamp, type?: string, start?: number, count?: number) => {
  const lastGames = await axios.default.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startDate}&type=${type}&start=${start}&count=${count}&api_key=${apiKey.key}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }}).catch((err) => {
    console.log(err.response);
  });
  if (lastGames) {
    return lastGames;
  }
  return null;
};

// EUW1_6328283680

const getInfoGameLol = async (matchId: string) => {
  const infoGame = await axios.default.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey.key}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }}).catch((err) => {
    console.log(err.response);
  });
  if (infoGame) {
    return infoGame;
  }
  return null;
};


export const getDataGames = async () => {
  const listGamesId = await lastLolGamesPlayer("NEzMyDmOisZMnvdvllbPhw4WFmWUvHSgpfDLJdGC_zJWZ1Do5839pozl3Euj5A7T01b1yY2eq1DSww", 16546516, "ranked", 0, 1);
  if (listGamesId) {
    for (let i = 0; i < listGamesId.data.length; i++) {
      const infoGame = await getInfoGameLol(listGamesId.data[i]);
      await createSubSubcollection("tournaments", "UaCHNfDDtZhXh0vlDsbk", "participants", "NEzMyDmOisZMnvdvllbPhw4WFmWUvHSgpfDLJdGC_zJWZ1Do5839pozl3Euj5A7T01b1yY2eq1DSww", "games", infoGame?.data);
      console.log(infoGame?.data);
    }
  }
};
