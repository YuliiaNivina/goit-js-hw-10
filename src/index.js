import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(evt) {
  const inputValue = (evt.target.value).trim();

  if (inputValue < 1) {
  return
  };

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.success(
          `Too many matches found. Please enter a more specific name.`
        );
        clearMarkup();

      } else if (countries.length <= 10 && countries.length >= 2) {
        addMurkupList(countries, createCountriesListMarkup);

      } else if (countries.length === 1) {
        addMurkupInfo(countries, createCountryInfoMarkup);

      } else if(countries.length < 1){
        return
      }
    })
    .catch(errorSearch);
}

function clearMarkup() {
  refs.ul.innerHTML = '';
  refs.div.innerHTML = '';
}
function addMurkupList(countries, callback) {
  callback(countries);
  refs.div.innerHTML = '';
  refs.ul.innerHTML = createCountriesListMarkup(countries);
}
function addMurkupInfo(countries, callback) {
  callback(countries);
  refs.ul.innerHTML = '';
  refs.div.innerHTML = createCountryInfoMarkup(countries);
}
function createCountriesListMarkup(countries) {
  return countries.map(({ name, flags }) => {
    return `
    <li>
        <img class="flag" src = ${flags.svg} width = 60>
        <p>${name.official}</p>
      </li>
     `;
  });
}
function createCountryInfoMarkup(countries) {
  return countries.map(({ name, flags, capital, population, languages }) => {
    return `
        <div><img class="flag" src = ${flags.svg} width = 60>
    <p>${name.official}</p></div>
    <p>Capital:<span>${capital}</span></p>
    <p>Population:<span>${population}</span></p>
    <p>Languages:<span>${Object.values(languages)}</span></p>`;
  });
}

function errorSearch(error) {
  clearMarkup()
      Notiflix.Notify.failure(
          `Oops, there is no country with that name`
        );
}