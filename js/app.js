const apiKey = "043e603ee46fdc38badf5b7d05d2d148";
const imgApi = "https://image.tmdb.org/t/p/w1280";
const resultsArea = document.querySelector(".result");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector(".search-btn");
const homeLink = document.querySelector(".home");
let pageNumber = 1;

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

function createCard(movie) {
  const {
    poster_path: posterPath,
    original_title,
    release_date: releaseDate,
    overview,
  } = movie;
  const imagePath = posterPath ? imgApi + posterPath : "./img/notFound.png";
  let truncatedTitle;
  if (original_title) {
    truncatedTitle =
      original_title.length > 15
        ? original_title.slice(0, 15) + "..."
        : original_title;
  } else {
    truncatedTitle =
      movie.original_name.length > 15
        ? movie.original_name.slice(0, 15) + "..."
        : movie.original_name;
  }
  const formattedDate = releaseDate ? releaseDate : "No release date";
  const card = `
    <div class="card">
      <a href="">
        <img
          src="${imagePath}"
          alt="${original_title}"
          width="100%"
        />
      </a>
      <div class="card-content">
        <div class="card-header">
          <div class="left-content">
            <h3>${truncatedTitle}</h3>
            <span>${formattedDate}</span>
          </div>
          <button class="card-btn">
            <a
              target="_blank"
              href="${imagePath}"
              >See Cover</a
            >
          </button>
        </div>
        <div class="information">
          ${overview}
        </div>
      </div>
    </div>
  `;

  return card;
}

async function showResult(url) {
  var data = await fetchData(url);
  console.log(data);
  if (data && data.results) {
    data.results.map(async (movie) => {
      const { poster_path: posterPath } = movie;
      const image = new Image();
      image.src = posterPath ? imgApi + posterPath : "./img/notFound.png";

      image.onload = function () {
        resultsArea.innerHTML += createCard(movie);
      };
    });
  }
  console.log(document.querySelectorAll(".card").length);
}

async function loadMoreResult() {
  pageNumber++;
  const movieName = searchInput.value.trim();
  const searchUrl = searchInput.value
    ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}&page=${pageNumber}`
    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${pageNumber}`;

  await showResult(searchUrl);
}

document.addEventListener("DOMContentLoaded", async () => {
  resultsArea.innerHTML = "";
  const searchUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${pageNumber}`;
  pageNumber = 1;
  await showResult(searchUrl);
});

window.addEventListener("scroll", () => {
  if (
    document.body.offsetHeight + window.scrollY >=
      document.body.scrollHeight - 10 &&
    document.querySelectorAll(".card").length === pageNumber * 20
  ) {
    loadMoreResult();
  }
});

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const movieName = searchInput.value.trim();
  if (movieName) {
    pageNumber = 1;
    resultsArea.innerHTML = "";
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieName}&page=${pageNumber}`;
    await showResult(searchUrl);
  }
});

homeLink.addEventListener("click", async () => {
  searchInput.value = "";
  const searchUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${pageNumber}`;
  resultsArea.innerHTML = "";
  await showResult(searchUrl);
});
