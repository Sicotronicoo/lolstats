/* eslint-disable max-len */
import * as axios from "axios";
import {createSubSubcollection} from "./document.service";
import * as db from "../services/document.service";
/* import * as functions from "firebase-functions"; */

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


export const getDataGames = async (path: string, docId: string, subPath: string, subDocId: string, subSubPath: string) => {
  const timeStamp = await lastGameByPlayer(`/tournaments/${docId}/participants/${subDocId}`, docId, subDocId);
  const listGamesId = await lastLolGamesPlayer(subDocId, timeStamp, "ranked", 0, 7);
  if (listGamesId) {
    for (let i = 0; i < listGamesId.data.reverse().length; i++) {
      const infoGame = await getInfoGameLol(listGamesId.data[i]);
      await createSubSubcollection(path, docId, subPath, subDocId, subSubPath, infoGame?.data);
    }
  }
};

const lastGameByPlayer = async (path: string, tournamentId: string, puuid: string) => {
  const timeStamp = await db.getLastDateGameLol(tournamentId, puuid);
  if (timeStamp !== undefined) {
    return timeStamp.data().info.gameEndTimestamp;
  } else {
    console.log("paso");
    const timeStamp = await (await db.getDoc(path)).get("createdAt");
    console.log(timeStamp._seconds);
    return timeStamp._seconds;
  }
};


