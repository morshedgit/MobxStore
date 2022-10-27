import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello to you from Firebase!");
});
/**
 * Gets users info
 */
export const getUsers = functions.https.onRequest((request, response) => {
  //   admin.auth
  //     .getAuth()
  //     .getUsers([])
  //     .then((getUsersResult) => {
  //       console.log("Successfully fetched user data:");
  //       getUsersResult.users.forEach((userRecord) => {
  //         console.log(userRecord);
  //       });
  //       console.log("Unable to find users corresponding to these identifiers:");
  //       getUsersResult.notFound.forEach((userIdentifier) => {
  //         console.log(userIdentifier);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching user data:", error);
  //     });
});
