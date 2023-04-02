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
      },
    }).catch((err) => {
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
      },
    }).catch((err) => {
    console.log(err.response);
  });
  if (infoGame) {
    return infoGame;
  }
  return null;
};

const generateGamePoints = (gameInfo: any, puuid: string, wins: number, losses: number) => {
  const playerGame: string[] = [...gameInfo.info.participants];
  const participantInfo: any = playerGame.find((participant: any) => participant.puuid === puuid);
  const dataForPoints: number[] = [
    20,
    participantInfo.kills,
    participantInfo.assists,
    participantInfo.tripleKills * 3,
    participantInfo.quadraKills * 4,
    participantInfo.pentaKills * 5,
    participantInfo.win === true ? 30 : 0,
    participantInfo.visionScore * 1.5,
    participantInfo.firstTowerKill === true ? 15 : 0,
    // participantInfo.totalDamageDealtToChampions * 0.0001,
    participantInfo.gameEndedInEarlySurrender === true ? -10 : 0,
    participantInfo.gameEndedInSurrender === true ? -5 : 0,
  ];
  let points = 0;
  for (let i = 0; i < dataForPoints.length; i++) {
    points += dataForPoints[i];
  }
  const dataPoints: any[] = [];
  if (participantInfo.win) {
    dataPoints.push({wins: wins + 1, points: points - (participantInfo.deaths * 1.5), losses: losses});
  } else {
    dataPoints.push({wins: wins, losses: losses + 1, points: points - (participantInfo.deaths * 1.5)});
  }
  return {wins: dataPoints[0].wins, losses: dataPoints[0].losses, points: dataPoints[0].points};
};

export const getDataGames = async (path: string, tournamentId: string) => {
  const participants = await db.getDoc(`/tournaments/${tournamentId}`);
  const participantsList = await participants.get("players");
  for (let i = 0; i < participantsList.length; i++) {
    const participant = await db.getDoc(`/tournaments/${tournamentId}/participants/${participantsList[i]}`);
    const listIdGamesDb = participant.get("games");
    const startTime = participant.get("updatedAt");
    const currentPoints = participant.get("points");
    const wins = participant.get("wins");
    const losses = participant.get("losses");
    if (listIdGamesDb === null) {
      const lastIdGames = await lastLolGamesPlayer(participantsList[i], "ranked", startTime._seconds, 5);
      if (lastIdGames !== null) {
        // await db.updateDoc(`tournaments/${tournamentId}/participants/`, {id: participantsList[i], games: [...lastIdGames.data]});
        const games: any[] = [];
        for (let j = 0; j < lastIdGames.data.length; j++) {
          games.push(lastIdGames.data[j]);
          const infoGame = await getInfoGameLol(lastIdGames.data[j]);
          await db.createSubSubcollection(path, tournamentId, "participants", participantsList[i], "games", infoGame?.data);
          const points = generateGamePoints(infoGame?.data, participantsList[i], wins, losses);
          await db.updateDoc(`tournaments/${tournamentId}/participants/`, {id: participantsList[i], points: points.points, wins: points.wins, losses: points.losses, games: games});
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
            const points = generateGamePoints(infoGame?.data, participantsList[i], wins, losses);
            if (currentPoints === null) {
              await db.updateDoc(`tournaments/${tournamentId}/participants/`, {id: participantsList[i], points: points.points, wins: points.wins, losses: points.losses, games: copyListGamesDbArray});
            } else {
              const totalPoints = points + currentPoints;
              console.log("Currents points = " + totalPoints);
              await db.updateDoc(`tournaments/${tournamentId}/participants/`, {id: participantsList[i], points: points.points, wins: points.wins, losses: points.losses, games: copyListGamesDbArray});
            }
            await db.createSubSubcollection(path, tournamentId, "participants", participantsList[i], "games", infoGame?.data);
          }
        }
      }
      await db.updateDoc(`tournaments/${tournamentId}/participants/`, {id: participantsList[i]});
    }
  }
};


