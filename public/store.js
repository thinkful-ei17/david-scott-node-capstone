'use strict';

class Store {
  // Setting all the store properties to null is not strictly necessary
  //  but it does provide a nice way of documenting the fields
  constructor() {
    this.list = null;
    this.currentSong = null;
    this.users = null;
    this.currentUser = null;
    this.songsFromSearch = null;
    this.view = 'home';

  }

  insertSong(doc){
    this.currentSong = doc;
    this.list.push(doc);
  }

  findById(id) {
    return this.list.find(song => song.id === id);
  }  

  findByIdAndRemove(id) {
    this.list = this.list.filter(song => song.id !== id);
  }

  findByIdAndUpdate(doc) {
    this.currentSong = doc;
    let obj = this.findById((doc.id));
    if (obj) {
      Object.assign(obj, doc);
    }
    return obj;
  }

  findUserByUsername(doc) {
    return this.users.find(user => user.username === doc);
  }

  findByIdUser(id) {
    return this.users.find(user => user.id === id);
  }  

  findByIdAndUpdateUser(doc) {
    this.currentUser = doc;
    let obj = this.findByIdUser((doc.id));
    if (obj) {
      Object.assign(obj, doc);
    }
    return obj;
  }

}