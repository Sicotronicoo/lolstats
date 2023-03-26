/* eslint-disable max-len */
import * as axios from "axios";
import * as db from "../services/document.service";
/* import * as functions from "firebase-functions"; */

const apiKey = JSON.parse(process.env.API_LOL ? process.env.API_LOL : "{}");
const lastLolGamesPlayer = async (puuid: string, type?: string, startTime?: number, count?: number) => {
  const lastGames = await axios.default.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&type=${type}&count=${count}&api_key=${apiKey.key}`,
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


export const getDataGames = async (path: string, docId: string) => {
  const participants = await db.getDoc(`/tournaments/${docId}`);
  const participantsList = await participants.get("players");
  for (let i = 0; i < participantsList.length; i++) {
    const participant = await db.getDoc(`/tournaments/${docId}/participants/${participantsList[i]}`);
    const listIdGamesDb = participant.get("games");
    const startTime = participant.get("updatedAt");
    if (listIdGamesDb === null) {
      const lastIdGames = await lastLolGamesPlayer(participantsList[i], "ranked", startTime._seconds, 5);
      if (lastIdGames !== null) {
        await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], games: [...lastIdGames.data]});
        for (let j = 0; j < lastIdGames.data.length; j++) {
          const infoGame = await getInfoGameLol(lastIdGames.data[j]);
          await db.createSubSubcollection(path, docId, "participants", participantsList[i], "games", infoGame?.data);
        }
      }
    } else {
      const lastIdGames = await lastLolGamesPlayer(participantsList[i], "ranked", startTime._seconds, 5);
      if (lastIdGames !== null && lastIdGames.data.length) {
        const copyListGamesDbArray = [...listIdGamesDb];
        for (let k = 0; k < lastIdGames.data.length; k++) {
          const gameIdExists = copyListGamesDbArray.includes(lastIdGames.data[k]);
          if (!gameIdExists) {
            copyListGamesDbArray.push(lastIdGames.data[k]);
            const infoGame = await getInfoGameLol(lastIdGames.data[k]);
            await db.createSubSubcollection(path, docId, "participants", participantsList[i], "games", infoGame?.data);
            await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], games: [...copyListGamesDbArray]});
          }
        }
      }
      await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i]});
    }
  }
};


