let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

//Evento para receber valores do html ao carregar a página
window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');
  totalPopulationFavorites = document.querySelector(
    '#totalPopulationFavorites'
  );
  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

//Função para receber e manipular dados do arquivo json da url
async function fetchCountries() {
  const res = await fetch('http://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

//Função para renderizar o que será exibido em tela
function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleCountryButtons();
}

//Função de renderização da 1a lista de países em tela
function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn">+</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}

//Função de renderização da 2a lista de paises em tela
function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    favoritesHTML += favoriteCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

//Função para mostrar a quantidade de países está sendo mostrado em cada lista
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}

//Função para acionar o evento dos botões
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

//Função para adicionar os países de forma ordenada na 2a lista
function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  favoriteCountries = [...favoriteCountries, countryToAdd];

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

//Função para retornar os países para a 1a lista
function removeFromFavorites(id) {
  const countryToRemove = favoriteCountries.find(
    (country) => country.id === id
  );

  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);

  render();
}

//Função de formatação
function formatNumber(number) {
  return numberFormat.format(number);
}
