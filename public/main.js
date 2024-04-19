const HomePage = {
  Top: {list: [], name: 'Top'}, // Top 5 new Releases
  New: {list: [], name: 'New Movies'}, // Top 45 new releases after Top 5
  Upcoming: {list: [], name: 'Upcoming Movies'}, // Top 40 new releases
  TopRated: {list: [], name: 'Top Rated Movies'}, // Top 40 rated movies
  MyList: {list: [], name: 'My List'}, // Favourites
};

const Genres = {}

const genreNames = {
  "28": "Action",
  "12": "Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "10751": "Family",
  "14": "Fantasy",
  "36": "History",
  "27": "Horror",
  "10402": "Music",
  "9648": "Mystery",
  "10749": "Romance",
  "878": "Science Fiction",
  "10770": "TV Movie",
  "53": "Thriller",
  "10752": "War",
  "37": "Western"
}

async function init_Home() {
  // Initializng Home Page
  let timeout = 200;
  let retries = 3;
  let retryCount = 0;

  try {
      // Top 5 Latest
      let new_result1;
      while (retryCount < retries) {
        new_result1 = await sendRequest('MDB', 'list/movies/1'); // latest 20 movies
        if (!new_result1.finalResponse) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, timeout));
        } else {
            break;
        }
      }
      let top5 = new_result1.finalResponse.results.slice(0, 5);
      for (let movie of top5) {
          let fullMovie;
          retryCount = 0;
          while (retryCount < retries) {
            fullMovie = await sendRequest('MDB', `description/movies?movieId=${movie.movieId}`);
            if (!fullMovie.result) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
            } else {
                break;
            }
          }
          fullMovie.result.trailer = '';
          try {
              fullMovie.result.trailer = getTrailer(fullMovie.result.videos.results);
          } catch (e) {
              console.error(e);
          }

          HomePage.Top.list.push(fullMovie.result);
      }
      // Top Latest
      HomePage.New.list.push(...new_result1.finalResponse.results.slice(5)); // remaining latest goes in new container

      let new_result2;
      retryCount = 0;
      while (retryCount < retries) {
          new_result2 = await sendRequest('MDB', 'list/movies/2');
          if (!new_result2.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
      }
      HomePage.New.list.push(...new_result2.finalResponse.results); // add another page of new movies to new container

      // Upcoming Movies
      let upcoming_result1;
      retryCount = 0;
      while (retryCount < retries) {
          upcoming_result1 = await sendRequest('MDB', 'upcoming/movies?page=1');
          if (!upcoming_result1.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
      }
      HomePage.Upcoming.list.push(...upcoming_result1.finalResponse.results);

      let upcoming_result2;
      retryCount = 0;
      while (retryCount < retries) {
          upcoming_result2 = await sendRequest('MDB', 'upcoming/movies?page=2');
          if (!upcoming_result2.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
      }
      HomePage.Upcoming.list.push(...upcoming_result2.finalResponse.results);

      // Top Rated Movies
      let toprated_result1;
      retryCount = 0;
      while (retryCount < retries) {
          toprated_result1 = await sendRequest('MDB', 'toprated/movies?page=1');
          if (!toprated_result1.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
      }
      HomePage.TopRated.list.push(...toprated_result1.finalResponse.results);

      let toprated_result2;
      retryCount = 0;
      while (retryCount < retries) {
          toprated_result2 = await sendRequest('MDB', 'toprated/movies?page=2');
          if (!toprated_result2.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
      }
      HomePage.TopRated.list.push(...toprated_result2.finalResponse.results);

      // My List (User's Favourites)
  } catch (e) {
      console.error('Error loading Home:', e)
  }
  //display Home
  displayHome();
}

function addGenreToList(movie) {
  if (movie.genres) {
    for (const genre of movie.genres) { 
      if (!Genres.hasOwnProperty(genre.id)) {
        Genres[genre.id] = [];
      }
      // Check for duplicates
      if (!Genres[genre.id].some(m => m.movieId === movie.movieId)) {
        Genres[genre.id].push(movie);
      }
    }
  } else if (movie.genre_ids) {
    for (const id of movie.genre_ids) {
      if (!Genres.hasOwnProperty(id)) {
        Genres[id] = [];
      }
       // Check for duplicates
       if (!Genres[id].some(m => m.movieId === movie.movieId)) {
        Genres[id].push(movie);
      }
    }
  }
}

async function init_Genres() {
  try {
    for (const catalog in HomePage) {
      for (const movie of HomePage[catalog].list) {
        addGenreToList(movie);
      }
    }

    try {
      for (const genre in Genres) {
        const lastMovie = Genres[genre][Genres[genre].length-1];
        let timeout = 200;
        let retries = 3;
        let retryCount = 0;
        let result;

        while (retryCount < retries) { // Loop for movies
          result = await sendRequest('MDB', `related/movies?movieId=${lastMovie.movieId}&page=1`);
          if (!result.finalResponse) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, timeout));
          } else {
              break;
          }
        }

        if (result.finalResponse) {
          for (const movie of result.finalResponse.results) {
              addGenreToList(movie);
          }
        }
      }
    }catch(e) {
      console.error("Error getting more genres:", e);
    }
    // Get More Movies:
  } catch(e) {
    console.error("Error Loading Genres:", e);
  }
}


function displayHome() {
  let result = document.querySelector('#home');
  
  let html = `
    <container id="highlight"></container>

  `;
  for (let genre in HomePage) {
    if (genre === 'Top')
      continue;
    html += addItem(genre ,HomePage[genre].name, HomePage[genre].list);
  }

  result.innerHTML = html;
  setVideo(HomePage.Top.list[0]);

  // Start the loop to play top movies
  playTopMoviesLoop();
}


function displayGenres() {
  let result = document.querySelector('#genres');

  let html = '';
  for (let genre in Genres) {
    const genre_name = genreNames[genre];
    html += addItem(genre_name, genre_name, Genres[genre]);
  }

  result.innerHTML = html;
}

function playTopMoviesLoop() {
  let currentIndex = 0;
  let movies = HomePage.Top.list;

  // Function to play the next movie trailer
  function playNextMovie() {
      // Set the video for the current movie
      if (document.querySelector('#home') === null) {
        setVideo(movies[currentIndex]);

        // Move to the next movie index
        currentIndex = (currentIndex + 1) % movies.length;
   
      }
      // Schedule the next movie to play after 30 seconds
      setTimeout(playNextMovie, 30000); // 30 seconds
  }

  // Start playing the first movie
  playNextMovie();
}

function displaySearches(searches) {
  let result = document.querySelector('#searches');
  let html = '';
  for (let movie of searches) {
    let imgElement = document.createElement('img');
    imgElement.onload = function() { // some images dont load so this ignores those movies
      html += `
        <div class="catalog_item" onclick="navigate('Movie', './details.html', ${movie.movieId})">
        <img src='${movie.poster_path}'/>
        </div>
      `;
      result.innerHTML = html;
    };
    imgElement.src = movie.poster_path;
  }
}

async function displayMovieDetails(movieId) {
  let result = document.querySelector('#details');
  let html = '';
  try {

    // Getting the Movie Data
    let timeout = 200;
    let retries = 3;
    let retryCount = 0;
    let fullMovie;
    while (retryCount < retries) {
      fullMovie = await sendRequest('MDB', `description/movies?movieId=${movieId}`);
      if (!fullMovie.result) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, timeout));
      } else {
          break;
      }
    }
    console.log("Full Movie:", fullMovie !== null);
    fullMovie.result.trailer = '';
    try {
        fullMovie.result.trailer = getTrailer(fullMovie.result.videos.results);
    } catch (e) {
        console.error(e);
    }

    let genres = '';
    for (let genre of fullMovie.result.genres) {
        genres += genre.name;
        if (genre !== fullMovie.result.genres[fullMovie.result.genres.length -1])
            genres += ",  ";
    }

    // Setting the Movie Data HTML
    html = `
      <div class="m_details_background_img">
        <img src=${fullMovie.result.backdrop_path} alt="">
      </div>

      <div class="m_details_content_top">
        <div class="m_details_content">
          
          <div class="m_title_container">
            <div class="m_title">
              <h1>${fullMovie.result.title}</h1>
            </div>
            

            <div class="m_info">
              <p>Release Date: ${fullMovie.result.release_date}</p>
              <p>Rating: ${fullMovie.result.vote_average}/10</p> <i class="fa-brands fa-imdb"></i>
              <p>Genres: ${genres}</p>
            </div> 
          </div>
        </div>
      </div>

      <div class="m_details_content_middle">
        <div class="m_poster">
          <div class="m_poster_img">
            <img src=${fullMovie.result.poster_path} alt="">
          </div>
          
          <div class="m_trailer">
            <iframe 
            src="https://www.youtube.com/embed/${fullMovie.result.trailer}">
            </iframe>
          </div>
        </div>
      </div>
      
      <div class="m_details_content_bottom">
        <strong>Description</strong>
        <p>${fullMovie.result.overview}</p>

        <div class="m_add_to_list">
            <button class="add_to_list_btn">Add to List</button>
        </div>
      </div>
    `;
    document.title = fullMovie.result.title;
  } catch (e) {
    console.error("Failed to get Movie Details: ", e);
  }
  result.innerHTML = html;
}

async function init() {
  let content = document.querySelector('#page');
  let response = await fetch('./home.html');
  content.innerHTML = await response.text();
  document.title = 'Home';
  history.pushState({title:'Home', url: './home.html'}, null, './home.html');

  await init_Home();
  await init_Genres();
}


init();
