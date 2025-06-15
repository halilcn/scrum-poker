import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase/setup";
import { db } from "@/lib/firebase/setup";
import { ref, push, serverTimestamp, set, onValue, off } from "firebase/database";
import {
  getUserIdCookie,
  getRoomIdCookie,
  removeRoomIdCookie,
  getUsernameCookie,
} from "@/utils/cookieActions";
import { remove as firebaseRemove, ref as dbRef } from "firebase/database";

export async function loginAnonymously() {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Room Schema Example:
 *
 * rooms/
 * ├── {roomId}/
 * │   ├── createdAt: timestamp
 * │   ├── createdBy: string (userId)
 * │   ├── participants/
 * │   │   ├── {userId}/
 * │   │   │   ├── userId: string
 * │   │   │   └── point: number | null
 * │   ├── roomName: string
 * │   └── status: "voting" | "completed"
 *
 * Example Data:
 * {
 *   "rooms": {
 *     "room123": {
 *       "createdAt": 1709123456789,
 *       "createdBy": "user456",
 *       "participants": {
 *         "user456": {
 *           "userId": "user456",
 *           "point": 5
 *         },
 *         "user789": {
 *           "userId": "user789",
 *           "point": null
 *         }
 *       },
 *       "roomName": "Sprint Planning",
 *       "status": "voting"
 *     }
 *   }
 * }
 */

// Tek bir participant objesi döndürür
const getRoomParticipant = ({ userId, username = "" }) => ({
  userId,
  username,
  point: null,
  isActive: true,
});

// Birden fazla participant için obje döndürür (ör: oda oluştururken)
const getNewRoomParticipants = (userId, username = "") => ({
  [userId]: getRoomParticipant({ userId, username }),
});

export async function createRoom({ roomName }) {
  const createdBy = getUserIdCookie();
  const username = getUsernameCookie();
  const participants = getNewRoomParticipants(createdBy, username);
  const roomRef = ref(db, "rooms");
  const roomData = {
    roomName,
    participants,
    status: "voting",
    createdAt: serverTimestamp(),
    createdBy,
  };
  const newRoomRef = await push(roomRef, roomData);
  const roomId = newRoomRef.key;
  await push(ref(db, `rooms/${roomId}/roomId`), roomId);
  return roomId;
}

export async function logoutFromRoom() {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const participantRef = dbRef(db, `rooms/${roomId}/participants/${userId}`);
  await firebaseRemove(participantRef);
  removeRoomIdCookie();
}

export async function checkRoomExists(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  return new Promise((resolve) => {
    onValue(roomRef, (snapshot) => {
      resolve(snapshot.exists());
    }, { onlyOnce: true });
  });
}

export async function joinRoom(roomId) {
  const userId = getUserIdCookie();
  if (!userId) return;
  const username = getUsernameCookie();
  const participantRef = ref(db, `rooms/${roomId}/participants/${userId}`);
  const participant = getRoomParticipant({ userId, username });
  await set(participantRef, participant);
  return roomId;
}

// Katılımcının username bilgisini günceller
export async function updateParticipantUsername(newUsername) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const usernameRef = dbRef(db, `rooms/${roomId}/participants/${userId}/username`);
  await set(usernameRef, newUsername);
}

// Room bilgilerini dinlemek için subscription oluştur
export function subscribeToRoom(roomId, callback) {
  const roomRef = dbRef(db, `rooms/${roomId}`);
  const unsubscribe = onValue(roomRef, callback);
  return unsubscribe;
}

// Room subscription'ını kaldır
export function unsubscribeFromRoom(roomRef, callback) {
  off(roomRef, "value", callback);
}

// Room name'ini günceller
export async function updateRoomName(roomName) {
  const roomId = getRoomIdCookie();
  if (!roomId) return;
  const roomNameRef = dbRef(db, `rooms/${roomId}/roomName`);
  await set(roomNameRef, roomName);
}
