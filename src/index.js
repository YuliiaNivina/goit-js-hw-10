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
  const inputValue = evt.target.value.trim();
  // console.log(inputValue);
  if (inputValue === '') {
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
        clearMarkup();
        // refs.ul.innerHTML = '';
        // refs.div.innerHTML = '';
      } else if (countries.length <= 10 && countries.length >= 2) {
        // console.log(countries);
        addMurkupList(countries, createCountriesListMarkup);
        // refs.div.innerHTML = '';
        // refs.ul.innerHTML = createCountriesListMarkup(countries);
      } else if (countries.length === 1) {
        // console.log(countries);
        addMurkupInfo(countries, createCountryInfoMarkup);
        // refs.ul.innerHTML = '';
        // refs.div.innerHTML = createCountryInfoMarkup(countries);
      } else if (countries.length < 1) {
        return;
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
  return countries
    .map(({ name, flags }) => {
      // const name = country.name.official;
      // const flag = country.flags.svg;
      //   console.log(country.name.official);
      // console.log(countries);
      return `
       <li class="counrty-item">
        <img class="flag" src = ${flags.svg} width = 50 >
        <p class=country-name>${name.common}</p>
       </li>`;
    })
    .join('');
}
function createCountryInfoMarkup(countries) {
  return countries
    .map(({ name, flags, capital, population, languages }) => {
      // const name = country.name.official;
      // const flag = country.flags.svg;
      //   const language = Object.values(languages);
      // console.log(capital);
      // console.log(name.official);
      // console.log(population);
      // console.log(languages);
      return `
      <div class=country-info__title>
        <img src = ${flags.svg} width = 50>
        <p class=country-info__name>${name.common}</p>
      </div>
      <p class=country-info__descr><b class=country-info__caption>Capital:</b>${capital}</p>
      <p class=country-info__descr><b class=country-info__caption>Population:</b>${population}</p>
      <p class=country-info__descr><b class=country-info__caption>Languages:</b>${Object.values(languages)}</p>`;
    })
    .join('');
}

function errorSearch(error) {
  // console.log(error);
  clearMarkup();
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}
