'use strict';
/* use global $ */


const STORE = {
  view: 'home', //home, search, search-results, add, read
};

function renderSearchForm(){
  console.log('renderSearchForm ran');
  $('main').html(generateSearchFormHTML());
}

function generateSearchFormHTML(){
    return `
      <form name='search-form' class='search-form, js-search-form' id='search-form'>
        <h2 for='search-form'>
        Search the Database!
      </h2>
      <lable for='title-input' class='search-lable'>Search by Title</lable>
      <input type='text' class='title-input, js-title-input' id='title-input' form='search-form' placeholder='title to search'>
      <lable for='title-search' class='search-lable'>Search By User</lable>
      <select name='title-search' class='title-search, js-title-search' id='title-search' form='search-form'>
        <option>song 1</option>
        <option>song 2</option>
        <option>song 3</option>
      </select>
      <button class='search-button, js-search-button'>
        Search Now!
      </button>
      </form>
    `
}





function generateResultsHTML(){
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
  `
}

function renderSearchResults(){
  console.log('renderSearchResults ran');
 $('main').html(generateResultsHTML());
}


// renderSearchForm();
renderSearchResults();


function renderPage(){
  switch(STORE.view){
  case 'home':
    renderHomePage()
    break;

  case 'search':
    renderSearch();
    break;

  case 'search-results':
    renderSearchResults();
    break;

  case 'add':
    break;

  case 'read':
    break;
  }
}








$(function(){
  renderPage();
});