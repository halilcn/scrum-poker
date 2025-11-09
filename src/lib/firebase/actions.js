import { signInAnonymously } from "firebase/auth";
import { auth, storage } from "@/lib/firebase/setup";
import { db } from "@/lib/firebase/setup";
import { ref, push, serverTimestamp, set, onValue, off, update } from "firebase/database";
import { remove as firebaseRemove, ref as dbRef } from "firebase/database";
import { ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import {
  getUserIdCookie,
  getRoomIdCookie,
  removeRoomIdCookie,
  getUsernameCookie,
} from "@/utils/cookieActions";

// Avatar URLs for random selection
export const AVATAR_URLS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Chase",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Kimberly",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Christian",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Eliza",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Leah",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sawyer",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Eden",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine",
];

// Default avatar URL (Katherine)
export const DEFAULT_AVATAR_URL = "https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine";

// Function to get random avatar URL
const getRandomAvatarUrl = () => {
  return AVATAR_URLS[Math.floor(Math.random() * AVATAR_URLS.length)];
};

export async function loginAnonymously() {
  const result = await signInAnonymously(auth);
  return result.user;
}

// Tek bir participant objesi döndürür
const getRoomParticipant = ({ userId, username = "", imageUrl = null }) => ({
  userId,
  username,
  imageUrl: imageUrl || getRandomAvatarUrl(),
  point: null,
  isActive: true,
  breakStatus: 'none',
  breakSeconds: 0,
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
    status: "waiting",
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

// Katılımcının avatar bilgisini günceller
export async function updateParticipantAvatar(newAvatarUrl) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const avatarRef = dbRef(db, `rooms/${roomId}/participants/${userId}/imageUrl`);
  await set(avatarRef, newAvatarUrl);
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

// Katılımcının point değerini günceller
export async function updateParticipantPoint(point) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const pointRef = dbRef(db, `rooms/${roomId}/participants/${userId}/point`);
  await set(pointRef, point);
}

// Room status'ını günceller
export async function updateRoomStatus(status) {
  const roomId = getRoomIdCookie();
  if (!roomId) return;
  const statusRef = dbRef(db, `rooms/${roomId}/status`);
  await set(statusRef, status);
}

// Tüm katılımcıların point'lerini temizler ve status'ı voting yapar
export async function resetRoomForNewVoting() {
  const roomId = getRoomIdCookie();
  if (!roomId) return;
  
  // Önce mevcut participants'ları al
  const participantsRef = dbRef(db, `rooms/${roomId}/participants`);
  return new Promise((resolve) => {
    onValue(participantsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const participants = snapshot.val();
        
        // Tüm katılımcıların point'lerini null yap
        const updates = {};
        Object.keys(participants).forEach(userId => {
          updates[`participants/${userId}/point`] = null;
        });
        
        // Status'ı voting yap
        updates['status'] = 'voting';
        
        // Batch update ile güncelle
        const roomRef = dbRef(db, `rooms/${roomId}`);
        await update(roomRef, updates);
      }
      resolve();
    }, { onlyOnce: true });
  });
}

// Kullanıcının belirli bir room'da participant olup olmadığını kontrol eder
export async function checkUserIsParticipant(roomId, userId) {
  if (!roomId || !userId) return false;
  
  const participantRef = dbRef(db, `rooms/${roomId}/participants/${userId}`);
  return new Promise((resolve) => {
    onValue(participantRef, (snapshot) => {
      resolve(snapshot.exists());
    }, { onlyOnce: true });
  });
}

// Katılımcının active durumunu true yapar
export async function setParticipantActive() {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const activeRef = dbRef(db, `rooms/${roomId}/participants/${userId}/isActive`);
  await set(activeRef, true);
}

// Katılımcının active durumunu false yapar
export async function setParticipantInactive(specificRoomId = null) {
  const roomId = specificRoomId || getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  const activeRef = dbRef(db, `rooms/${roomId}/participants/${userId}/isActive`);
  await set(activeRef, false);
}

// Reaction ekler
export async function addReaction(targetUserId, reaction) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId || !targetUserId || !reaction) return;
  
  const reactionsRef = dbRef(db, `rooms/${roomId}/reactions`);
  const reactionData = {
    userId: targetUserId,
    reaction: reaction,
    timestamp: serverTimestamp()
  };
  
  await push(reactionsRef, reactionData);
}

// Reactions'ları dinlemek için subscription oluştur
export function subscribeToReactions(roomId, callback) {
  const reactionsRef = dbRef(db, `rooms/${roomId}/reactions`);
  const unsubscribe = onValue(reactionsRef, callback);
  return unsubscribe;
}

// Eski reaction'ları temizler (5 saniyeden eski olanları)
export async function cleanOldReactions(roomId) {
  if (!roomId) return;
  
  const reactionsRef = dbRef(db, `rooms/${roomId}/reactions`);
  onValue(reactionsRef, async (snapshot) => {
    if (snapshot.exists()) {
      const reactions = snapshot.val();
      const now = Date.now();
      const updates = {};
      
      Object.keys(reactions).forEach((reactionId) => {
        const reaction = reactions[reactionId];
        // timestamp varsa ve 5 saniyeden eskiyse sil
        if (reaction.timestamp && typeof reaction.timestamp === 'number' && (now - reaction.timestamp > 5000)) {
          updates[reactionId] = null;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(reactionsRef, updates);
      }
    }
  }, { onlyOnce: true });
}

// Kick a specific user from the room
export async function kickUserFromRoom(targetUserId) {
  const roomId = getRoomIdCookie();
  if (!roomId || !targetUserId) return;
  
  const participantRef = dbRef(db, `rooms/${roomId}/participants/${targetUserId}`);
  await firebaseRemove(participantRef);
}

// Update participant break status
export async function updateParticipantBreakStatus(status, seconds = 0) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  
  const participantRef = dbRef(db, `rooms/${roomId}/participants/${userId}`);
  const updates = {
    breakStatus: status,
    breakSeconds: seconds
  };
  
  await update(participantRef, updates);
}

// Update participant break seconds (for countdown)
export async function updateParticipantBreakSeconds(seconds) {
  const roomId = getRoomIdCookie();
  const userId = getUserIdCookie();
  if (!roomId || !userId) return;
  
  const breakSecondsRef = dbRef(db, `rooms/${roomId}/participants/${userId}/breakSeconds`);
  await set(breakSecondsRef, seconds);
}

/**
 * Upload base64 image to Firebase Storage and return the download URL
 * @param {string} base64String - Base64 encoded image string
 * @param {string} userId - User ID for unique filename
 * @returns {Promise<string>} Download URL of the uploaded image
 */
export async function uploadBase64ImageToStorage(base64String, userId) {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `avatars/${userId}_${timestamp}.png`;
    
    // Create storage reference
    const imageRef = storageRef(storage, filename);
    
    // Upload base64 string to Firebase Storage
    await uploadString(imageRef, base64String, 'base64');
    
    // Get download URL
    const downloadURL = await getDownloadURL(imageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  }
}


