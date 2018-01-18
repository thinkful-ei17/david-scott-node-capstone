'use strict';

class Store {
  // Setting all the store properties to null is not strictly necessary
  //  but it does provide a nice way of documenting the fields
  constructor() {
    this.list = null;
    this.currentSong = null;
    this.users = null;
    this.songsFromSearch = null;
    this.view = 'home';

  }

  insert(doc){
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

}