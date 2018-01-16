/* global $ */
'use strict';



function generateAddPageHTML() {
  return `
  <form id="add" class="view">
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
  return generateAddPageHTML;
}

function renderReadPage() {
  return generateReadPageHTML;
}





function renderPage() {
  switch (STORE.view) {
  case 'home': $('.page').html.renderHomePage();
    break;
  case 'search': $('.page').html.renderSearchPage();
    break;
  case 'search-results': $('.page').html.renderSearchResultsPage();
    break;
  case 'add': $('.page').html.renderAddPage();
    break;
  case 'read': $('.page').html.renderReadPage();
    break;
  }
}








$(() => {
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

  $('.page').on('submit', '#home-submit-search', event => {
    event.preventDefault();
    STORE.view = 'search';

  });

  $('.page').on('submit', '#home-submit-add', event => {
    event.preventDefault();
    STORE.view = 'add';

  });

  $('.page').on('submit', '#search-submit', event => {
    event.preventDefault();
    STORE.view = 'search-results';

  });

  $('.page').on('submit', '#add-submit', event => {
    event.preventDefault();
    STORE.view = 'read';

  });

});
