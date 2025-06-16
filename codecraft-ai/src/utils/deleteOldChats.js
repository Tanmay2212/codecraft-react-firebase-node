// src/utils/deleteOldChats.js
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";

export const deleteOldChats = async (uid) => {
  const twoDaysAgo = Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));

  const q = query(
    collection(db, "user_chats"),
    where("uid", "==", uid),
    where("createdAt", "<", twoDaysAgo)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  console.log("🧹 Old chats deleted for UID:", uid);
};
