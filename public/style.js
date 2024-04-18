const navbar = document.querySelector('.navbar');
const searchBar = document.querySelector('#searchKey');
const home = document.querySelector('#home');
const searches = document.querySelector('#searches');
let searchArray = [];

// Search Bar
function searchClick() {
    searchBar.focus();
}

let searchTimer; // Variable to store the timer ID
searchBar.addEventListener("input", async function(event) {
    const key = event.target.value.trim();
    clearTimeout(searchTimer); // Clear any existing timer
    searchArray = [];
    if (key === "") { // Blank search
        home.style.display = 'block';
        searches.innerHTML = "";
        searches.style.display = 'none';
    } else { // Entered actual search
        home.style.display = 'none';
        searches.style.display = 'block';
        
        // Set a timer to wait for 1000 milliseconds (1 second) after the user stops typing
        searchTimer = setTimeout(async () => {
            try {
                let timeout = 200;
                let retries = 3;
                let retryCount = 0;
                let result;
                while (retryCount < retries) {
                    result = await sendRequest('MDB', `search/movies?q=${key}&page=1`);
                    if (!result.finalResponse && !result.results) {
                        retryCount++;
                        await new Promise(resolve => setTimeout(resolve, timeout));
                    } else {
                        break;
                    }
                }
                console.log("Search 1:", result.finalResponse !== null);
                if (result.finalResponse) {
                    searchArray.push(...result.finalResponse.results);
                } else {
                    searchArray.push(...result.results);
                }
                
                if (result.total_pages > 1) {
                    for (i = 2; i <= result.total_pages; i++) {
                        retryCount = 0;
                        let result2;
                        while (retryCount < retries) {
                            result2 = await sendRequest('MDB', `search/movies?q=${key}&page=${i}`);
                            if (!result2.finalResponse && !result2.results) {
                                retryCount++;
                                await new Promise(resolve => setTimeout(resolve, timeout));
                            } else {
                                break;
                            }
                        }
                        console.log(`Search ${i}:`, result.finalResponse !== null);
                        if (result2.finalResponse) {
                            searchArray.push(...result2.finalResponse.results);
                        } else {
                            searchArray.push(...result2.results);
                        }
                    }
                }
            } catch (e) {
                console.error("Error Searching Key:", key, e);
            }
            displaySearches(searchArray);
        }, 1500);
    }
});

// Video Settings
function setVideo(movie) {
    let videoFrame = document.querySelector('#highlight');

    let src = `https://www.youtube.com/embed/${movie.trailer}?enablejsapi=1&` +
            `controls=0&` +
            `rel=0&` +
            `autoplay=1&` +
            `loop=1&` +
            `mute=1&` +
            `disablekb=1`;


    let genres = '';
    for (let genre of movie.genres) {
        genres += genre.name;
        if (genre !== movie.genres[movie.genres.length -1])
            genres += "  ∘  ";
    }

    iframe = `
        <iframe class="video-iframe" src="${src}" allow="autoplay"></iframe>
        <div class="poster"><img src="${movie.poster_path}"></div>
        <div class="info">
            <h1>${movie.title}</h1>
            <h2>${genres}</h2>
            <h3>${movie.overview}</h3>
        </div>
    `;

    videoFrame.innerHTML = iframe;
}

function videoEnded() {
    console.log('Error loading video')
}


// Scroll Event (Left/Right)
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.style.backgroundColor = 'rgba(50, 50, 50, 1)';
    } else {
        navbar.style.backgroundColor = 'rgba(50, 50, 50, 0)';
    }
});

let isScrolling = false;
function scrollPrev(genre) {
    if (isScrolling) return;
    isScrolling = true;

    const container = document.querySelector(genre);
    container.scrollLeft -= container.clientWidth;

    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

function scrollNext(genre) {
    if (isScrolling) return;
    isScrolling = true;

    const container = document.querySelector(genre);
    container.scrollLeft += container.clientWidth;

    setTimeout(() => {
        isScrolling = false;
    }, 500);
}