import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, deleteDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save a movie ID for a user
async function saveMovieId(auth, movieId) {
    try {
        // Construct the data object to be stored in Firestore
        const movieData = {
            movieId,
            userId: auth.currentUser.uid,
        };

        // Add the movie data to the Firestore collection
        await addDoc(collection(db, "savedMovies"), movieData);
        
        console.log("Movie ID saved successfully");
    } catch (error) {
        console.error("Error saving movie ID:", error);
    }
}

// Function to remove a movie ID for a user
async function removeMovieId(auth, movieId) {
    try {
        // Query Firestore for the document corresponding to the movie ID and user ID
        const querySnapshot = await getDocs(query(collection(db, "savedMovies"), 
                                        where("userId", "==", auth.currentUser.uid),
                                        where("movieId", "==", movieId)));

        // Check if the document exists
        if (!querySnapshot.empty) {
            // Get the document ID
            const docId = querySnapshot.docs[0].id;
            // Delete the document
            await deleteDoc(doc(db, "savedMovies", docId));
            console.log("Movie ID removed successfully");
        } else {
            console.error("Movie ID not found for the user");
        }
    } catch (error) {
        console.error("Error removing movie ID:", error);
    }
}

// Function to retrieve all movie IDs for a user
async function getSavedMovieIds(auth) {
    try {
        // Query Firestore for all documents in the 'savedMovies' collection
        const q = query(collection(db, "savedMovies"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        // Initialize an array to store the retrieved movie IDs
        const movieIds = [];

        // Iterate through the query snapshot and extract movie IDs
        querySnapshot.forEach((doc) => {
            movieIds.push(doc.data().movieId);
        });

        return movieIds;
    } catch (error) {
        console.error("Error retrieving saved movie IDs:", error);
        return [];
    }
}

// Function to check if a movie ID exists for the current user
async function isMovieInList(auth, movieId) {
    try {
        const q = query(collection(db, "savedMovies"), 
                        where("movieId", "==", movieId),
                        where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // Return true if there are any documents in the query snapshot
    } catch (error) {
        console.error("Error checking movie ID:", error);
        return false;
    }
}

export { saveMovieId, getSavedMovieIds, removeMovieId, isMovieInList };
