// jshint esversion: 6

this.currentObj = {
  homeworld: null,
  species: null
};

this.filmArr = {};

this.filmObj = {};

this.planetObj = {};

function getObject(obj, link, callback) {
  let oReq = new XMLHttpRequest();
  oReq.addEventListener('load', parseObj);
  oReq.open('GET', link);
  oReq.send();
  function parseObj() {
    let tempStr = this.responseText;
    window[obj] = JSON.parse(tempStr);
    if(typeof callback === 'function') {
      callback();
    }
  }
}

function addTo(id, content, callback) {
  document.getElementById(id).innerText = content;
  if(typeof callback === 'function') {
    callback();
  }
}

function getAndAdd(obj, link, id, content, callback) {
  getObject(obj, link, () => {
    addTo(id, this[obj][content], callback);
  });
}

//getAndAdd("http://swapi.co/api/people/1/", 'person4Name', 'name');

var sequence = [
  'currentObj',
  'http://swapi.co/api/people/1/',
  'person4Name',
  'name',
  'currentObj',
  '$currentObj.homeworld',
  'person4HomeWorld',
  'name',
  'currentObj',
  'http://swapi.co/api/people/14/',
  'person14Name',
  'name',
  'currentObj',
  '$currentObj.species',
  'person14Species',
  'name'
];

function runThru(func, param, delim) {
  let tempStr = "";
  let i = 0;
  while(i < param.length) {
    if(i % delim === 0) {
      tempStr += "() => { " + func + "(";
    }
    tempStr += checkParam(param[i]);
    i++;
  }
  function checkParam(param) {
    if(param.charAt(0) === '$') {
      return `${param.substr(1)}, `;
    }else{
      return `"${param}", `;
    }
  }
  tempStr = tempStr.substr(0, tempStr.length - 2);
  for(let i = 0; i < param.length / delim; i ++) {
    tempStr += ") }";
  }
  tempStr = tempStr.substr(8, tempStr.length - 10);
  tempStr += ";";
  eval(tempStr);
}

runThru('getAndAdd', sequence, 4);

getObject('filmArr', 'http://swapi.co/api/films/', () => {
  let filmList = document.getElementById('filmList');
  filmArr = filmArr.results;
  for(let i = 0; i < filmArr.length; i++) {
    filmObj = filmArr[i];
    // li
    let li = document.createElement('li');
    li.className = 'film';
    // h2
    let h2 = document.createElement('h2');
    h2.className = 'filmTitle';
    h2.innerText = filmObj.title;
    // h3
    let h3 = document.createElement('h3');
    h2.innerText = 'Planets';
    // ul
    let ul = document.createElement('ul');
    ul.className = 'filmPlanets';
    for(let j = 0; j < filmObj.planets.length; j++) {
      getObject('planetObj', filmObj.planets[j], () => {
        let li = document.createElement('li');
        li.className = 'planet';
        let h4 = document.createElement('h4');
        h4.className = 'planetName';
        h4.innerText = planetObj.name;
        li.appendChild(h4);
        ul.appendChild(li);
      });
    }
    // append
    li.appendChild(h2);
    li.appendChild(h3);
    li.appendChild(ul);
    filmList.appendChild(li);
  }
});