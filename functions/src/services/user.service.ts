/* eslint-disable max-len */
import * as axios from "axios";
import * as db from "../services/document.service";

const KEY = "RGAPI-1ea273ee-e557-467f-8327-b4c29ca52ed0";


export const getIdImgPlayer = async (summonerName: string) => {
  console.log(summonerName.replace(" ", "%20"));

  const idImg = await axios.default.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName.replace(" ", "%20")}?api_key=${KEY}`,
    {
      headers: {
        "Accept-Language": "en-US,en;q=0.7",
      }}).catch((err) => {
    console.log(err);
  });
  if (idImg) {
    console.log(idImg);
    return idImg.data.profileIconId;
  }
  return null;
};


export const createIdImgVerification = async (summonerName: string, userId: string) => {
  const idImgPlayer = await getIdImgPlayer(summonerName);
  const imgs = ["27", "10", "21", "28", "19", "24", "20", "22", "17", "14", "16", "13",
    "15", "6", "18", "11", "23", "26", "25", "12", "7", "9", "5", "4", "1",
    "3", "0", "2", "8"];
  const randomNumber = Math.floor(Math.random() * imgs.length);
  let idLolVerification: string;
  if (imgs[randomNumber].toString() === idImgPlayer.toString()) {
    imgs.splice(imgs.indexOf(imgs[randomNumber]), 1);
    idLolVerification = imgs[Math.floor(Math.random() * imgs.length)];
    console.log(`http://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idLolVerification}.png`);
  } else {
    idLolVerification = imgs[randomNumber];
    console.log(`http://ddragon.leagueoflegends.com/cdn/13.5.1/img/profileicon/${idLolVerification}.png`);
  }
  await db.updateDoc("users", {id: userId, idLolVerification: idLolVerification});
};

export const confirmIdImgVerification = async (summonerName: string, idImg: string, userId: string) => {
  console.log(summonerName, idImg, userId);
  const actualIdimg = await getIdImgPlayer(summonerName);
  console.log(actualIdimg, idImg);
  if (actualIdimg.toString() === idImg.toString()) {
    await db.updateDoc("users", {id: userId, lolVerify: true});
  }
  await db.deleteField("users", userId, "idLolVerification");
};
