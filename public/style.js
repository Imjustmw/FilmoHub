const navbar = document.querySelector('#navbar');
const searchBar = document.querySelector('#searchKey');
const home = document.querySelector('#page');
const searches = document.querySelector('#searches');
let searchArray = [];

// Search Bar
function searchClick() {
    searchBar.focus();
}

let searchTimer; // Variable to store the timer ID
searchBar.addEventListener("input", debounce(async function(event) {
    const key = event.target.value.trim();
    clearTimeout(searchTimer); // Clear any existing timer
    searchArray = [];
    searches.innerHTML = "";
    if (key === "") { // Blank search
        home.style.display = 'block';
        searches.innerHTML = "";
        searches.style.display = 'none';
    } else { // Entered actual search
        home.style.display = 'none';
        searches.style.display = 'block';

        try {
            const result = await searchMovies(key);
            console.log("Search Movie:", result !== null);
            if (result) {
                searchArray.push(...result.results);
                const total_pages = result.total_pages;

                if (total_pages > 1) {
                    for (let i = 2; i <= total_pages; i++) {
                        const result2 = await searchMovies(key, i);
                        console.log("Search Movie:", result2 !== null);
                        if (result2) {
                            searchArray.push(...result2.results);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error Searching Key:", key, e);
        }
        displaySearches(searchArray);
    }
}, 1500));


async function searchMovies(key, page = 1) {
    const retries = 5;
    let retryCount = 0;
    let result;
    while (retryCount < retries) {
        result = await sendRequest('MDB', `search/movies?q=${key}&page=${page}`);
        if (result.finalResponse || result.results) {
            break;
        }
        retryCount++;
        await delay(200);
    }
    return result.finalResponse || result.results;
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
        <div class="poster" onclick="navigate('Movie', './details.html', ${movie.movieId})"><img src="${movie.poster_path}"></div>
        <div class="info">
            <h1 onclick="navigate('Movie', './details.html', ${movie.movieId})">${movie.title}</h1>
            <h2>${genres}</h2>
            <h3>${movie.overview}</h3>
        </div>
    `;

    videoFrame.innerHTML = iframe;
}

// movie list and preview
function getTrailer(trailers) {
    const reversed = [...trailers].reverse();
    for (let trailer of reversed) {
        if (trailer.type === "Trailer")
            return trailer.key;
    }
}

function getStars(voteAverage) {
    const maxStars = 5;
    const filledStars = Math.round((voteAverage / 10) * maxStars);
    let starsHTML = '';
    for (let i = 0; i < maxStars; i++) {
        if (i < filledStars) {
            starsHTML += '<i class="fa-solid fa-star"></i>'; // Assuming you have a star icon
        } else {
            starsHTML += '<i class="far fa-star"></i>'; // Assuming you have an outline star icon
        }
    }
    return starsHTML;
}

function addItem(id, title, array) {
    // list of movies
    let body = '';

    for (let movie of array) {
        const movieId = movie.movieId || movie.id;
        body += `
        <div class="catalog_item">
            <img src='${movie.poster_path}' onclick="navigate('Movie', './details.html', ${movieId})">
            <div class="details">
                <h1>${movie.title}</h1>
                <div class="stars">${getStars(movie.vote_average)}</div>
            </div>
        </div>
        `;
    }

    // catalog container
    let html = `
        <section class="catalog">
            <h2>${title}</h2>
            <div class="catalog_container" id="${id}">${body}</div>
            <button class="prev-button" onclick="scrollPrev('#${id}')"><</button>
            <button class="next-button" onclick="scrollNext('#${id}')">></button>
        </section>
    `;
    return html;
}

// Scroll Event (Left/Right)
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.backgroundColor = 'transparent';
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