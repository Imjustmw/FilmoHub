const HomePage = {
  Top: {list: [], name: 'Top'}, // Top 5 new Releases
  New: {list: [], name: 'New Movies'}, // Top 45 new releases after Top 5
  Upcoming: {list: [], name: 'Upcoming Movies'}, // Top 40 new releases
  TopRated: {list: [], name: 'Top Rated Movies'}, // Top 40 rated movies
  TvSeries: {list: [], name: 'TV Series'},
  MyList: {list: [], name: 'My List'}, // Favourites
};

const Movies = {

}

async function init_Home() {
  // Initializng Home Page
  let timeout = 200;
  let retries = 3;
  let retryCount = 0;

  try {
      // Top 5 Latest
      let new_result1 = await sendRequest('MDB', 'list/movies/1'); // latest 20 movies
      let top5 = new_result1.finalResponse.results.slice(0, 5);
      for (let movie of top5) {
          let fullMovie = await sendRequest('MDB', `description/movies?movieId=${movie.movieId}`);
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


async function init_Genres() {

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
}

function displaySearches(searches) {
  let result = document.querySelector('#searches');
  let html = '';
  for (let movie of searches) {
    let imgElement = document.createElement('img');
    imgElement.onload = function() { // some images dont load so this ignores those movies
      html += `
        <div class="catalog_item">
        <img src='${movie.poster_path}'/>
        </div>
      `;
      result.innerHTML = html;
    };
    imgElement.src = movie.poster_path;
  }
  
}

init_Home();