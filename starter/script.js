'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////////
// Render country
const renderCountry = function (data, countryName = '') {
  const html = ` <article class="country ${countryName}">
<img class="country__img" src="${data.flags.png}" />
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(
    +data.population / 10000000
  ).toFixed(1)}</p>
  <p class="country__row"><span>🗣️</span>${Object.values(data.languages).join(
    ', '
  )}</p>
  <p class="country__row"><span>💰</span>${Object.values(data.currencies)
    .map(curr => curr.name)
    .join(', ')}</p>
</div>
</article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

//////////////////////////////////////////
// Render Error
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};
// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     const html = ` <article class="country">
//           <img class="country__img" src="${data.flags.png}" />
//           <div class="country__data">
//             <h3 class="country__name">${data.name.common}</h3>
//             <h4 class="country__region">${data.region}</h4>
//             <p class="country__row"><span>👫</span>${(
//               +data.population / 10000000
//             ).toFixed(1)}</p>
//             <p class="country__row"><span>🗣️</span>${Object.values(
//               data.languages
//             ).join(', ')}</p>
//             <p class="country__row"><span>💰</span>${Object.values(
//               data.currencies
//             )
//               .map(curr => curr.name)
//               .join(', ')}</p>
//           </div>
//         </article>`;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountryData('pakistan');
// getCountryData('bharat');
// getCountryData('china');
// getCountryData('iran');
// getCountryData('afghanistan');

////////////////////////////////////////////
// Get neighbouring countries

// AJAX country call 1
// const getCountryNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     // Render country 1
//     renderCountry(data);

//     // Get neighbour country 2
//     const [neighbour] = data.borders;
//     if (!neighbour) return;

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       console.log(data2);

//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// getCountryNeighbour('pakistan');
// getCountryNeighbour('bharat');
// getCountryNeighbour('china');
// getCountryNeighbour('iran');
// getCountryNeighbour('russia');

///////////////////////////////////////////
// Callback hell and promises

// Before it was like this
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

// const request = fetch('https://restcountries.com/v3.1/name/pakistan');
// console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

//////////////////////////////////////////////
// Promises look a lot more cleaner and beautifull then the other

// const getJSON = function (url, errorMsg = 'Somethibg went wrong') {
//   return fetch(url).then(response => {
//     if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

//     return response.json();
//   });
// };
// const getCountryData = function (country) {
//   // Country 1
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       console.log(response);

//       if (!response.ok)
//         throw new Error(`Country not found (${response.status})`);

//       return response.json();
//     })
//     .then(data => {
//       // Show main country
//       renderCountry(data[0]);

//       // Get neighbours
//       const neighbours = data[0].borders;
//       if (!neighbours) return;

//       // Show each neighbour
//       neighbours.forEach(code => {
//         fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
//           .then(response => response.json())
//           .then(data => renderCountry(data[0], 'neighbour'));
//       });
//     })
//     .catch(err => {
//       console.log(`${err} 💥💥💥`);
//       renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      // Show main country
      renderCountry(data[0]);

      // Get neighbours
      const neighbours = data[0].borders;
      if (!neighbours) throw new Error('No neighbour found!');

      // Return fetch Promise for neighbours
      return getJSON(
        `https://restcountries.com/v3.1/alpha?codes=${neighbours.join(',')}`,
        'Country not found'
      );
    })
    .then(data => {
      // Render neighbours if any
      if (!data) return;
      data.forEach(country => renderCountry(country, 'neighbour'));
    })
    .catch(err => {
      console.error(`${err.message} 💥`);
      renderError(`Something went wrong 💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      // Always run at the end
      countriesContainer.style.opacity = 1;
    });
};

// Attach listener once
btn.addEventListener('click', function () {
  getCountryData('australia');
});

// Attach listener once
btn.addEventListener('click', function () {
  getCountryData('australia');
});