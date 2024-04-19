const servers = {
    MDB : {url: 'https://movie-database21.p.rapidapi.com/', host: 'movie-database21.p.rapidapi.com'}
}
const API_KEY = '90b7f788f8mshcbca84d4476a687p1c680djsn296b4a6b8a8d';

function executeScripts(Page, args){
    if (Page === "Genres") {
        displayGenres();
    } else if (Page === "Home") {
        displayHome();
    } else if (Page === "Movie") {
        displayMovieDetails(args);
    }
}

async function navigate(title, url, args){
    document.title = title;
    let content = document.querySelector('#page');
    if(url === null){
        content.innerHTML = "";
    }else{
        history.pushState({title:title, url: url, args: args}, null, url);
        let response = await fetch(url);
        content.innerHTML = await response.text();
        clearSearch();
        executeScripts(title, args);
    }
}

function handleBack(event, args){
    //if no links were clicked pushState() is never called
    //as pushState() is never called there will be no data in event.state
    if(event.state == null){
      navigate('FilmoHub', null);
    }else{
      //links were clicked before so we can get the text and url passed from handleClick()
      navigate(event.state.title, event.state.url, event.state.args);  
    }
}
window.addEventListener('popstate', handleBack);

function clearSearch(){
    const searches = document.querySelector('#searches');
    document.querySelector('#searchKey').value = "";
    document.querySelector('#page').style.display = 'block';
    searches.innerHTML = "";
    searches.style.display = 'none';
}

async function sendRequest(Server, type) {
    const url = servers[Server].url + type;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': servers[Server].host
        }
    };

    try {
        let response = await fetch(url, options);
        return response.json();
    } catch (e) {
        console.error(e);
    }
}