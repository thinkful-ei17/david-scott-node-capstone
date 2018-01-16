'use strict';

class Store {
  // Setting all the store properties to null is not strictly necessary
  //  but it does provide a nice way of documenting the fields
  constructor() {
    this.list = null;
    this.song = null;
    this.users = null;
    this.view = 'home';
  }

  insert(doc){
    this.item = doc;
    this.list.push(doc);
  }

  findById(id) {
    return this.list.find(item => item.id === Number(id));
  }  

  findByIdAndRemove(id) {
    this.list = this.list.filter(item => item.id !== Number(id));
  }

  findByIdAndUpdate(doc) {
    this.item = doc;
    let obj = this.findById(Number(doc.id));
    if (obj) {
      Object.assign(obj, doc);
    }
    return obj;
  }

  getUsers() {

  }

}