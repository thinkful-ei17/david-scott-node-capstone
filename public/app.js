/* global $ api Store */
'use strict';

const STORE = new Store();


// HTML generators

function generateHomePageHTML(){
  return `
  <header>   
    <h1>Welcome to Song Cellar!</h1>
    <h2>Refresh your memory while filling your glass!</h2>
  </header>

  <form id='home-page-form'>
  <div class='home-buttons'>
    <label for='home-submit-search' class='button, home-page-button' id='home-to-search'>To the Search!
      <button class='to-search, js-to-search' id='home-submit-search'>
      </button> 
    </label>  
    <label for='home-submit-add' class='button, home-page-button' id='home-to-add'>Add Lyrics Here! 
      <button class='to-add, js-add' id='home-submit-add'></button>
    </label>  
  <div>
  <form>

  `;
}

function generateAddPageHTML() {
  return `
  <form id="add-form" class="view">
    <fieldset>
      <label for='user-choose'>User</label>
      <select name='user-choose' class='user-choose, js-user-choose, add-input user-input' id='user-choose' form='add-form' required>
      <option></option>
      ${generateUserOptionsHTML()}
      </select>
      <div>
        <label for="title">Title</label>
        <input class='add-input title-input' type="text" name="title" required>
      </div>
      <div>
        <label for="artist">Artist</label>
        <input class='add-input artist-input' type="text" name="artist">
      </div> 
      <div>
        <label for="lyrics">Lyrics</label>
        <textarea class='add-input lyrics-input' type="text" rows="10" cols="50" name="lyrics" required></textarea>
      </div>
      <div>
        <label for="notes">Notes</label>
        <input class='add-input notes-input' type="text" name="notes">
      </div>
      <label for="submit-add" class="submit-buttons">Add Song
      <button id="submit-add"></button>
      </label>
    </fieldset>
  </form>
  `;
}

function generateReadPageHTML() {
  const song = STORE.currentSong;
  return `
  <div id="read" class="view">
    <h3>Title: ${song.title}</h3>
    <p>Artist: ${song.artist}</p>
    <p class='read-lyrics'>
      ${song.lyrics}
    </p>
    <p>Notes:</br>${song.notes}</p>
    <label for='edit-button' class='edit-buttons'>Edit
        <button id='edit-button'></button>
    </label>
    <label for='delete-button' class='edit-buttons'>Delete   
    <button onclick="return confirm('Are you sure you want to delete?')" id='delete-button'></button>
    </label>
    </div>

  `;
}

function generateSearchPageHTML(){
  return `
      <form name='search-form' class='search-form, js-search-form' id='search-form'>
        <h2 for='search-form'>
          Search the Database!
        </h2>
      
        <lable for='title-input' class='search-lable'>Search by Title</lable>
        <input type='text' class='title-input, js-title-input, add-input' name= 'title-input' id='title-input' form='search-form' placeholder='title to search'>
        </br>
          <p>OR</p>
        </br>
        <lable for='title-search' class='search-lable'>Search By User</lable>
        <select name='user-search' class='user-search, js-user-search' id='user-search' form='search-form'>
            <option></option>
            ${generateUserOptionsHTML()}
        </select>
        </br>
        <label for='search-submit' class='search-button'>Search Now!</label>
        <button class='search-button, js-search-button' id='search-submit'>
        </button>
        </label>
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
      ${makeSearchResultsList()}
      </ul>
    </section>
  `;
}

function generateListPageHTML() {
  return `
    <h2>List of All Songs</h2>
    <ul class='songs-list'>
      ${renderList().join('')}
    </ul>
  `;
}

function generateEditPageHTML() {
  return `
  <form id="edit-form" class="view">
    <fieldset>
      <label for='user-choose-edit'>User</label>
      <select name='user-choose' class='user-choose, js-user-choose user-input' id='user-choose-edit' form='add-form' required>
      <option></option>
      ${generateUserOptionsHTML()}
      </select>
      <div>
        <label for="title">Title</label>
        <input class='title-input add-input' type="text" name="title" required>
      </div>
      <div>
        <label for="artist">Artist</label>
        <input class='artist-input add-input' type="text" name="artist">
      </div> 
      <div>
        <label for="lyrics">Lyrics</label>
        <textarea class='lyrics-input' type="text" rows="10" cols="50" name="lyrics" required></textarea>
      </div>
      <div>
        <label for="notes">Notes</label>
        <input class='notes-input add-input' type="text" name="notes">
      </div>
      <label for="submit-edit" class="submit-buttons">Edit Song
      <button id="submit-edit"></button>
      </label>
    </fieldset>
  </form>
  `;
}

function generateUserOptionsHTML() {
  const userOptions = STORE.users.map(user => {
    return `<option id="${user.id}" class="user">${user.username}</option>`;
  });
  return userOptions;
}


// Page Renderers

function renderHomePage(){
  $('main').html(generateHomePageHTML());
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
  if(STORE.message){
    $('main').append(`<h4>${STORE.message}</h4>`);
  }
}

function renderSearchResultsPage() {
  console.log('renderSearchResults ran');
  $('main').html(generateSearchResultsHTML());
}

function renderList() {
  return STORE.list.map(song => {
    return `
    <li id="${song.id}">
      <a href="#" class="song">${song.title}</a> <span>By:${song.artist}</span>
    </li>
    `;
  });
}

function renderListPage() {
  $('main').html(generateListPageHTML());
}

function renderEditPage() {
  const el = $('main');
  $('main').html(generateEditPageHTML());
  const song = STORE.currentSong;
  console.log(song);
  el.find('[name=title]').val(song.title);
  el.find('[name=artist]').val(song.artist);
  el.find('[name=lyrics]').val(song.lyrics);
  el.find('[name=notes]').val(song.notes);
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
  case 'list':
    renderListPage();
    break;
  case 'edit':
    renderEditPage();
    break;
  }
}


// Helper Functions

function searchSongByTitle(title){
  console.log('store.list[0]:', STORE.list[0]);
  const songs = STORE.list.filter(song => song.title.toLowerCase().includes(title));
  console.log('songs:', songs);
  if (songs.length === 1){
    STORE.currentSong = songs[0];
    STORE.message = null;
    STORE.view = 'read';
  }
  else if (songs.length > 1){
    STORE.songsFromSearch = songs;
    STORE.message = null;
    STORE.view = 'search-results';
  }
  else {
    STORE.message = 'There is no match for that title.';
  }
}

function searchSongByUser(userToSearch){
  const users = STORE.users;
  console.log('STORE.users:', STORE.users);
  const userMatch = users.find(user => user.username === userToSearch);
  console.log('user:', userMatch);
  const songs = userMatch.songs;
  STORE.songsFromSearch = songs;
  console.log('STORE.songsFromSearch:', STORE.songsFromSearch);
}

function searchForSongs(){
  const title = $('#title-input').val().toLowerCase().trim();
  const user = $('.js-user-search').val();
  console.log(`title: ${title} user: ${user}`);

  if(title){
    searchSongByTitle(title);
  }
  else if(user){
    searchSongByUser(user);
    STORE.view = 'search-results';
  }
  else {
    STORE.message = 'The search will work better if you enter a title OR select a User.'; 
  }
}

function makeSearchResultsList(){
  //change this back to STORE.songsFromSearch when I figure out that part//
  const resultList = STORE.songsFromSearch.map(song => {
    return `
    <li id="${song.song_id}">
      <a href="#" class="song">${song.title}</a><span>Written By:${song.artist}</span>
    </li>
    `;
  });
  return resultList.join(' ');
}

function getUsers() {
  api.searchAllUsers()
    .then(response => {
      //this response isn't returning songs
      console.log('api.searchAllUsers returned:', response);
      STORE.users = response.map(res => res);
      console.log('getAllUsers made store.users:',STORE.users);
    })
    .catch(err => console.error(err));
}

function getAllSongs() {
  api.searchAllSongs()
    .then(response => {
      console.log('api.searchAllSongs returned:', response);
      // STORE.list = response.map(res => res.body);
      STORE.list = response;
      console.log('store.list set by getAllSongs:', STORE.list);
    })
    .catch(err => console.error(err));
}

function getOneSong(id) {
  api.searchOneSong(id)
    .then(response => {
      STORE.song = response;
    })
    .catch(err => console.error(err));
}

function createSong(event) {
  const el = $(event.target);
  const userName = el.find('[name=user-choose]').val();
  const user = STORE.findUserByUsername(userName);
  console.log(user);
  const song = {
    title: el.find('[name=title]').val(),
    lyrics: el.find('[name=lyrics]').val(),
    artist: el.find('[name=artist]').val(),
    notes: el.find('[name=notes]').val()
  };

  api.create(song)
    .then(response => {
      STORE.insertSong(response);
      STORE.currentSong = response;
      const formatResponse = {
        song_id: response.id,
        title: response.title,
        artist: response.artist
      };
      user.songs.push(formatResponse);
      STORE.findByIdAndUpdateUser(user);
      return STORE.findByIdUser(user.id);
    })
    .then(userr => {
      console.log(userr);
      api.updateUser(userr);
      STORE.view = 'read';
      renderPage();
    })
    .catch(err => {
      console.error(err);
    });
}

function deleteSong() {
  const id = STORE.currentSong.id;
  api.remove(id)
    .then(() => {
      STORE.findByIdAndRemove(id);
      STORE.currentSong = null;
      STORE.view = 'list';
      renderPage();
    })
    .catch(err => {
      console.error(err);
    });
}

function songDetails(event) {
  const el = $(event.target);
  const id = el.closest('li').attr('id');
  console.log(STORE.currentSong);
  STORE.currentSong = STORE.findById(id);
  console.log(STORE.currentSong);
  STORE.view = 'read';
  renderPage();
  // console.log(id);
  // api.details(id)
  //   .then(response => {
  //     STORE.currentSong = response;
  //     STORE.view = 'read';
  //     renderPage();
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
}

function editSong(event) {
  const el = $(event.target);
  const id = STORE.currentSong.id;
  const updatedSong = {
    id: id,
    title: el.find('[name=title]').val(),
    lyrics: el.find('[name=lyrics]').val(),
    artist: el.find('[name=artist]').val(),
    notes: el.find('[name=notes]').val() 
  };
  api.updateSong(updatedSong)
    .then(() => {
      STORE.findByIdAndUpdate(updatedSong);
      STORE.view = 'read';
      renderPage();
    })
    .catch(err => {
      console.error(err);
    });
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

  $('.nav-bar').on('click', '#nav-list', () => {
    STORE.view = 'list';
    renderPage();
  });
}


$(() => {
  renderPage();
  getUsers();
  getAllSongs();
  navBarEventListeners();

  $('main').on('click', '#home-submit-search', event => {
    event.preventDefault();
    console.log('#home-submit-search was clicked');
    STORE.view = 'search';
    renderPage();
  });

  $('main').on('click', '#home-submit-add', event => {
    event.preventDefault();
    console.log('#home-submit-add was clicked');
    STORE.view = 'add';
    renderPage();
  });

  $('main').on('click', '.js-search-button', function(event){
    event.preventDefault();
    // const title = $('#title-input').val().toLowerCase().trim();
    // const user = $('.js-user-search').val();
    searchForSongs();
    renderPage();
  });  

  $('main').on('submit', '#add-form', event => {
    event.preventDefault();
    console.log('#add-form was submittted');
    createSong(event);
  });

  $('main').on('click', '#edit-button', event => {
    event.preventDefault();
    STORE.view = 'edit';
    renderPage();
  });

  $('main').on('submit', '#edit-form', event => {
    event.preventDefault();
    editSong(event);
  });

  $('main').on('click', '#delete-button', event => {
    event.preventDefault();
    deleteSong(event);
  });

  $('main').on('click', '.song', event => {
    event.preventDefault();
    songDetails(event);
  });
});
