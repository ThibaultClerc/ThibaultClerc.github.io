const form = document.querySelector('#myForm');
const cardDeck = document.querySelector('.deck');
const errDom = document.querySelector('#error');
const modals = document.querySelector('#modals');

let searchMovie = (event) => {
  const input = document.querySelector('#movieSearch');
  const button = document.querySelector('#searchButton');
  event.preventDefault();
  getMovies(input.value);
}

async function getMovies(movie) {
    const API = `http://www.omdbapi.com/?s=${movie}&apikey=cdfe7c8a`;
    let response = await fetch(API);
    let data = await response.json();
    let searchedMovies = data.Search;
    showMovies(searchedMovies);
    modalCreator(searchedMovies);
    console.log(data)
}

let showMovies = (movies) => {
  const dots = document.querySelector('#dot-container');
  dots.innerHTML = "";
  cardDeck.innerHTML = "";
  movies.forEach(movie => {
    if (movie.Poster === "N/A") {
      movie.Poster = "blank.png"
    }
    const movieCard = document.createElement("div");
    movieCard.className = "card-container  col-lg-4 mb-5 justify-content-center";
    movieCard.innerHTML = `
      <div class="card mx-auto shadow w-100">
        <div class="card-horizontal">
          <div class="img-square-wrapper">
              <img class="poster" src="${movie.Poster}" alt="Card image cap">
          </div>
          <div class="card-body">
            <h5 class="card-title movie-title">${movie.Title}</h5>
            <h6 class="card-title">${movie.Year}</h6>
            <button type="button" class="btn btn-outline-info btn-sm" data-toggle="modal" data-target="#modal-${movie.Title.replace(/[^A-Z0-9]+/ig, '_')}" onclick="modalTrigger('${movie.Title}')">En savoir plus</button>
          </div>
        </div>
      </div>`;
    cardDeck.appendChild(movieCard);
  })
}

async function modalTrigger(movie) {
  const plotAPI = `http://www.omdbapi.com/?t=${movie}&apikey=cdfe7c8a`;
  let response = await fetch(plotAPI);
  let data = await response.json();
  console.log(data)
  let movieTitleRegexed = data.Title.replace(/[^A-Z0-9]+/ig, "_")
  const theFuckingPlot = document.querySelector(`#plot-${movieTitleRegexed}`)
  if (data.Plot === "N/A") {
    theFuckingPlot.innerHTML = `
      Ce film n'a aucun résumé disponible sur notre site.</br>
      <a href="https://www.imdb.com/title/${data.imdbID}/?ref_=fn_al_tt_1">En voir plus sur IMDB</a>
    `
  } else {
    theFuckingPlot.innerHTML = data.Plot
  }
}

let modalCreator = (movies) => {
  movies.forEach(movie => {
    let modal = document.createElement("div")
    let movieTitleRegexed = movie.Title.replace(/[^A-Z0-9]+/ig, "_")
    modal.className = "modal fade";
    modal.id = `modal-${movieTitleRegexed}`;
    modal.tabIndex = "-1";
    modal.role = "dialog";
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body d-inline modal-horizontal">
            <div class="text-center">
              <img class="img-responsive mb-3 text-center" src="${movie.Poster}" alt="Card image cap">
            </div>
            <h3>${movie.Title}</h3>
            <h5>${movie.Year}</h5>
            <hr>
            <p id="plot-${movieTitleRegexed}"></p>
          </div>
        </div>
      </div>`;
    modals.parentNode.insertBefore(modal, modals.nextSibling);
  });
};