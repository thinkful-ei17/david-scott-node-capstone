/* global $ api Store */
'use strict';

const STORE = new Store();

function generateHomePageHTML(){
  return `
  <header>   
    <h1>Welcome to Song Cellar!</h1>
    <h2>Refresh your memory while filling your glass!</h2>
  </header>

  <form>
    <button class='to-search, js-to-search' id='home-submit-search'>To the Search!</button> 
    <button class='to-add, js-add' id='home-submit-add'>Add Lyrics Here!</button>
  </form>
  `;
}

function renderHomePage(){
  $('main').html(generateHomePageHTML());
}


function generateAddPageHTML() {
  return `
  <form id="add-form" class="view">
    <fieldset>
      <div>
        <label for="title">Title</label>
        <input type="text" name="title">
      </div>
      <div>
        <label for="author">Author</label>
        <input type="text" name="author">
      </div> 
      <div>
        <label for="lyrics">Lyrics</label>
        <textarea type="text" rows="10" cols="50" name="lyrics"></textarea>
      </div>
      <div>
        <label for="notes">Notes</label>
        <input type="text" name="notes">
      </div>
    </fieldset>
    <button id="submit-add">Submit</button>
  </form>`;
}

function generateReadPageHTML() {
  return `
  <div id="read" class="view">
    <h3>Replace with title</h3>
    <p>Replace with author</p>
    <p>Replace with lyrics</p>
    <p>Replace with notes</p>
  </div>`;
}

function renderAddPage() {
  $('main').html(generateAddPageHTML());
}

function renderReadPage() {
  $('main').html(generateReadPageHTML());
}

function renderSearchPage(){
  console.log('renderSearchPage ran');
  $('main').html(generateSearchPageHTML());
}

function generateSearchPageHTML(){
  return `
      <form name='search-form' class='search-form, js-search-form' id='search-form'>
        <h2 for='search-form'>
        Search the Database!
      </h2>
      <lable for='title-input' class='search-lable'>Search by Title</lable>
      <input type='text' class='title-input, js-title-input' id='title-input' form='search-form' placeholder='title to search'>
      <lable for='title-search' class='search-lable'>Search By User</lable>
      <select name='title-search' class='title-search, js-title-search' id='title-search' form='search-form'>
      ${generateUserOptionsHTML()}
      </select>
      <button class='search-button, js-search-button' id='search-submit'>
        Search Now!
      </button>
      </form>
    `;
}

function generateSearchResultsHTML() {
  console.log('generateSearchResultsHTML ran');

  return `
    <header>
      <h1>Pick A Song!</h1>
    </header>

    <section class='show-results, js-show-results'>
      <ul class='results-list, js-results-list'>
        <li class='search-result'><a href=''>Song 1</a></li>
        <li class='search-result'><a href=''>Song 2</a></li>
        <li class='search-result'><a href=''>Song 3</a></li>
      </ul>
    </section>
  `;
}

function renderSearchResultsPage() {
  console.log('renderSearchResults ran');
  $('main').html(generateSearchResultsHTML());
}

function getUsers() {
  api.searchAllUsers()
    .then(response => {
      STORE.users = response.map(res => res.username);
    })
    .catch(err => console.error(err));
}

function generateUserOptionsHTML() {
  const userOptions = STORE.users.map(user => {
    return `<option class="user">${user}</option>`;
  });
  return userOptions;
}


function renderPage() {
  switch (STORE.view) {
  case 'home': 
    renderHomePage();
    break;
  case 'search':
    renderSearchPage();
    break;
  case 'search-results':
    renderSearchResultsPage();
    break;
  case 'add': 
    renderAddPage();
    break;
  case 'read': 
    renderReadPage();
    break;
  }
}


function navBarEventListeners(){
  $('.nav-bar').on('click', '#nav-home', () => {
    STORE.view = 'home';
    renderPage();
  });

  $('.nav-bar').on('click', '#nav-search', () => {
    STORE.view = 'search';
    renderPage();
  });
  
  $('.nav-bar').on('click', '#nav-add', () => {
    STORE.view = 'add';
    renderPage();
  });
}


$(() => {
  renderPage();
  getUsers();
  navBarEventListeners();

  $('main').on('click', '#home-submit-search', event => {
    STORE.view = 'search';

    renderPage();
  });

  $('main').on('click', '#home-submit-add', event => {
    event.preventDefault();
    STORE.view = 'add';
    renderPage();
  });

  $('main').on('submit', '#search-form', event => {
    event.preventDefault();
    STORE.view = 'search-results';
    renderPage();
  });

  $('main').on('submit', '#add-form', event => {
    event.preventDefault();
    STORE.view = 'read';
    renderPage();

  });

});
