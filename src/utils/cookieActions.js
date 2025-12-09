import Cookies from "js-cookie";
import { COOKIE_USERNAME, COOKIE_USERID, COOKIE_EXPIRE_DAYS, COOKIE_ROOMID, COOKIE_RAFFLE_SEEN } from "@/constants/cookie";

export function setUsernameCookie(username) {
  Cookies.set(COOKIE_USERNAME, username, { expires: COOKIE_EXPIRE_DAYS });
}

export function getUsernameCookie() {
  return Cookies.get(COOKIE_USERNAME);
}

export function setUserIdCookie(userId) {
  Cookies.set(COOKIE_USERID, userId, { expires: COOKIE_EXPIRE_DAYS });
}

export function getUserIdCookie() {
  return Cookies.get(COOKIE_USERID);
}

export function setRoomIdCookie(roomId) {
  Cookies.set(COOKIE_ROOMID, roomId, { expires: COOKIE_EXPIRE_DAYS });
}

export function getRoomIdCookie() {
  return Cookies.get(COOKIE_ROOMID);
}

export function removeRoomIdCookie() {
  Cookies.remove(COOKIE_ROOMID);
}

export function setRaffleSeenCookie() {
  Cookies.set(COOKIE_RAFFLE_SEEN, "true", { expires: COOKIE_EXPIRE_DAYS });
}

export function getRaffleSeenCookie() {
  return Cookies.get(COOKIE_RAFFLE_SEEN);
} 