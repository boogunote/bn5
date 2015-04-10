import {Utility} from '../utility';
import {Common} from '../common'

export class Node{
  static inject() { return [Common, Utility]; }
  constructor(common, utility){
    this.common = common;
    this.utility = utility;
  }

  getRowAndColomeById(id) {
    for (var i = 0; i < this.rootVM.file.rows.length; i++) {
      for (var j = 0; j < this.rootVM.file.rows[i].tiles.length; j++) {
        if(id == this.rootVM.file.rows[i].tiles[j].id) {
          return {row: i, column: j};
        }
      }
    };
  }

  getCleanTile(tile) {
    return {
      id: tile.id,
      flex: tile.flex,
      url: tile.url
    }
  }

  getCleanRow(row) {
    var tiles = [];
    for (var i = 0; i < row.tiles.length; i++) {
      tiles.push(this.getCleanTile(row.tiles[i]));
    };
    return {
      id: row.id,
      height: row.height,
      tiles: tiles
    }
  }

  getCleanMosaic(file) {
    var rows = [];
    for (var i = 0; i < file.rows.length; i++) {
      rows.push(this.getCleanRow(file.rows[i]));
    };
    return {
      meta: {
        id: file.meta.id,
        create_time: file.meta.create_time,
        name: file.meta.name,
        type: file.meta.type
      },
      rows: rows
    }
  }
}