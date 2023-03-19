/* eslint-disable max-len */
import * as axios from "axios";
import * as db from "../services/document.service";
import * as functions from "firebase-functions";


const apiKey = JSON.parse(process.env.API_KEY_LOL ? process.env.API_KEY_LOL : "{}");


export const getPlayerLol = async (summonerName: string) => {
  const player = await axios.default.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName.replace(" ", "%20")}?api_key=${apiKey.key}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }}).catch((err) => {
    console.log(err.response);
  });
  if (player) {
    return player;
  }
  return null;
};

export const getPlayerDivisionLol = async (summonerId: string) => {
  const infoDivisions = await axios.default.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey.key}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }}).catch((err) => {
    return err.response.status;
  });
  if (infoDivisions) {
    return infoDivisions;
  }
  return null;
};


export const createIdImgVerification = async (summonerName: string, userId: string) => {
  const player = await getPlayerLol(summonerName);
  if (player === null) {
    return null;
  }
  const imgs = ["27", "10", "21", "28", "19", "24", "20", "22", "17", "14", "16", "13",
    "15", "6", "18", "11", "23", "26", "25", "12", "7", "9", "5", "4", "1",
    "3", "0", "2", "8"];
  const randomNumber = Math.floor(Math.random() * imgs.length);
  let idLolVerification: string;
  if (player && imgs[randomNumber] == player.data.profileIconId) {
    imgs.splice(imgs.indexOf(imgs[randomNumber]), 1);
    idLolVerification = imgs[Math.floor(Math.random() * imgs.length)];
  } else {
    idLolVerification = imgs[randomNumber];
  }
  await db.updateDoc("users", {id: userId, idLolVerification: idLolVerification});
  return idLolVerification;
};

export const confirmIdImgLolVerification = async (summonerName: string, idImg: string, userId: string) => {
  const player = await getPlayerLol(summonerName);
  if (player && player.data.profileIconId == idImg) {
    const divisionsData = await getPlayerDivisionLol(player.data.id);
    if (divisionsData) {
      await db.createSubcollection("users", userId, {...player.data, divisions: [...divisionsData.data], game: "league of legends"});
      await db.deleteField("users", userId, "idLolVerification");
      functions.logger.info(`Account ${player.data.name} has been add`);
      return true;
    }
  }
  await db.deleteField("users", userId, "idLolVerification");
  return false;
};
