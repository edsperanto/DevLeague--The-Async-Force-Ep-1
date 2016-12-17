// jshint esversion: 6

this.currentObj = {
  homeworld: null,
  species: null
};

this.filmObj = {};

function getObject(link, callback) {
  let oReq = new XMLHttpRequest();
  oReq.addEventListener('load', parseObj);
  oReq.open('GET', link);
  oReq.send();
  function parseObj() {
    let tempStr = this.responseText;
    currentObj = JSON.parse(tempStr);
    callback();
  }
}

function addTo(id, content, callback) {
  document.getElementById(id).innerText = content;
  if(typeof callback === 'function') {
    callback();
  }
}

function getAndAdd(link, id, content, callback) {
  getObject(link, () => {
    addTo(id, currentObj[content], callback);
  });
}

//getAndAdd("http://swapi.co/api/people/1/", 'person4Name', 'name');

var sequence = [
  'http://swapi.co/api/people/1/',
  'person4Name',
  'name',
  '$currentObj.homeworld',
  'person4HomeWorld',
  'name',
  'http://swapi.co/api/people/14/',
  'person14Name',
  'name',
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

runThru('getAndAdd', sequence, 3);

getObject('http://swapi.co/api/films/');

document.getElementById('filmList').innerHtml += `
<li class="film">
  <h2 class="filmTitle"></h2>
  <h3>Planets</h3>
  <ul class="filmPlanets">
    <li class="planet">
      <h4 class="planetName"></h4>
    </li>
  </ul>
</li>
`;