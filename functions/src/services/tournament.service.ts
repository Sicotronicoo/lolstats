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

const generateGamePoints = (gameInfo: any, puuid: string) => {
  const playerGame: string[] =[...gameInfo.info.participants];
  const participantInfo: any = playerGame.find((participant: any) => participant.puuid === puuid);
  const dataForPoints: number[] = [
    10,
    participantInfo.kills,
    participantInfo.assists,
    participantInfo.tripleKills * 3,
    participantInfo.quadraKills * 4,
    participantInfo.pentaKills *5,
    participantInfo.win === true ? 30 : -10,
    participantInfo.visionScore * 0.1,
    participantInfo.firstTowerKill === true ? 15 : 0,
    participantInfo.totalDamageDealtToChampions * 0.0001,
    participantInfo.gameEndedInEarlySurrender === true ? -10 : 0,
    participantInfo.gameEndedInSurrender === true ? -5 : 0,
  ];
  let points = 0;
  for (let i = 0; i < dataForPoints.length; i++) {
    points += dataForPoints[i];
  }
  return points - (participantInfo.deaths * 2);
};

export const getDataGames = async (path: string, docId: string) => {
  const participants = await db.getDoc(`/tournaments/${docId}`);
  const participantsList = await participants.get("players");
  for (let i = 0; i < participantsList.length; i++) {
    const participant = await db.getDoc(`/tournaments/${docId}/participants/${participantsList[i]}`);
    const listIdGamesDb = participant.get("games");
    const startTime = participant.get("updatedAt");
    const currentPoints = participant.get("points");
    if (listIdGamesDb === null) {
      const lastIdGames = await lastLolGamesPlayer(participantsList[i], "ranked", startTime._seconds, 5);
      if (lastIdGames !== null) {
        await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], games: [...lastIdGames.data]});
        for (let j = 0; j < lastIdGames.data.length; j++) {
          const infoGame = await getInfoGameLol(lastIdGames.data[j]);
          await db.createSubSubcollection(path, docId, "participants", participantsList[i], "games", infoGame?.data);
          const points = generateGamePoints(infoGame?.data, participantsList[i]);
          await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], points});
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
            const points = generateGamePoints(infoGame?.data, participantsList[i]);
            if (currentPoints === null) {
              await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], points: points});
            } else {
              await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i], points: points + +currentPoints});
            }
            await db.createSubSubcollection(path, docId, "participants", participantsList[i], "games", infoGame?.data);
          }
        }
      }
      await db.updateDoc(`tournaments/${docId}/participants/`, {id: participantsList[i]});
    }
  }
};


