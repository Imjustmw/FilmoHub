import { auth } from "./auth.js";
import { saveMovieId, removeMovieId, getSavedMovieIds, isMovieInList } from "./data.js";

async function addToMyList(movieId) {
    try {
        const user = auth.currentUser;
        if (user) {
            const isInList = await isMovieInList(auth, movieId);
            if (!isInList) {
                await saveMovieId(auth, movieId);
                console.log("Movie ID added to the list successfully:", movieId);
                document.getElementById('addToList').innerHTML = "Remove From List";
            } else {
                console.log("Movie ID is already in the list");
                await removeFromMyList(movieId);
            }
        } else {
            console.error("User is not logged in");
        }
    } catch (error) {
        console.error("Error adding movie ID to the list:", error);
    }
}

async function removeFromMyList(movieId) {
    try {
        // Check if the user is logged in
        const user = auth.currentUser;
        if (user) {
            // Remove the movie ID from the list
            await removeMovieId(auth, movieId);
            console.log("Movie ID removed from the list successfully");
            document.getElementById('addToList').innerHTML = "Add To List";
        } else {
            // Handle the case where the user is not logged in
            console.error("User is not logged in");
        }
    } catch (error) {
        console.error("Error removing movie ID from the list:", error);
    }
}

async function isInMyList(movieId) {
    const user = auth.currentUser;
    if (user) {
        const isInList = await isMovieInList(auth, movieId);
        return isInList;
    } else {
        console.error("User is not logged in");
        return false;
    }
}

async function getMyList() {
    try {
        // Check if the user is logged in
        const user = auth.currentUser;
        if (user) {
            // Remove the movie ID from the list
            let movies = await getSavedMovieIds(auth);
            console.log("Successfully got saved Movies");
            return movies;
        } else {
            // Handle the case where the user is not logged in
            console.error("User is not logged in");
            return [];
        }   
    } catch (error) {
        console.error("Error getting saved Movies:", error);
        return [];
    }
}

window.addToMyList = addToMyList;
window.isInMyList = isInMyList;
window.getMyList = getMyList;