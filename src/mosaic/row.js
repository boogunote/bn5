import {Utility} from '../utility';
import {Common} from '../common';
import {Node} from './node';

export class Tile extends Node{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;
  }

  activate(model){
    this.parentVM = model.parentVM;
    this.rootVM = this.parentVM.rootVM;
    this.row = model.row;
  }

  newTile() {
    var tile = {
      id: this.utility.getUniqueId(),
      flex: 1,
      url: ""
    }
    this.row.tiles.push(tile);
    this.updateRow();
  }

  removeRow() {
    this.parentVM.removeRow(this.row.id);
  }

  removeTile(id) {
    var position = -1;
    for (var i = 0; i < this.row.tiles.length; i++) {
      if(id == this.row.tiles[i].id) {
        position = i;
        break;
      }
    };

    this.row.tiles.splice(position, 1);
    this.updateRow();
  }

  resetRow() {
    for (var i = this.row.tiles.length - 1; i >= 0; i--) {
      this.row.tiles[i].flex = 1;
    };
    this.updateRow();
  }

  setHeight(increase) {
    this.row.height += increase ? 100 : -100;
    this.updateRow();
  }

  updateRow() {
    var position = -1;
    for (var i = 0; i < this.rootVM.file.rows.length; i++) {
      if(this.row.id == this.rootVM.file.rows[i].id) {
        position = i;
        break;
      }
    };

    var that = this;
    this.doEdit(function() {
      if (that.rootVM.fileRef)
        that.rootVM.fileRef
            .child("rows/"+position)
            .set(that.getCleanRow(that.row));
    });
  }
}