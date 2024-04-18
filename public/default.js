const servers = {
    MDB : {url: 'https://movie-database21.p.rapidapi.com/', host: 'movie-database21.p.rapidapi.com'}
}
const API_KEY = '90b7f788f8mshcbca84d4476a687p1c680djsn296b4a6b8a8d';

function executeScripts(){
    let script = document.querySelector('script').innerText;
    try{
      new Function(script)();
    }catch(e){
      console.error(e);
    }   
  }

async function navigate(title, url){
    document.title = title;
    let content = document.querySelector('#main');
    if(url === null){
        content.innerHTML = "";
    }else{
        let response = await fetch(url);//fetch another page eg battery.html
        content.innerHTML = await response.text();
        executeScripts();
    }
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

function getTrailer(trailers) {
    const reversed = [...trailers].reverse();
    for (let trailer of reversed) {
        if (trailer.type === "Trailer")
            return trailer.key;
    }
}

function addItem(id, title, array) {
    // list of movies
    let body = '';
    for (let movie of array) {
        body += `
        <div class="catalog_item">

            <img src='${movie.poster_path}'/>
           
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