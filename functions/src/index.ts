import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord: any, context: any) => {
  const { email, uid } = userRecord;

  return db
    .collection("users")
    .doc(uid)
    .set({ username: email, role: "subscriber" })
    .catch(console.error);
};

export const authOnCreate = functions.auth.user().onCreate(createProfile);
