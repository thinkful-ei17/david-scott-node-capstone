/* global $ api Store */
'use strict';


function getSongTitlesByUser(user){
    const query = {username: user};
    api.searchAllUsers(query)
      .then(user => {
        console.log(user);
        // STORE.users = response.map(res => res.username);
      })
      .catch(err => console.error(err));
      // STORE.view = 'search-results';
      // renderPage();
  }