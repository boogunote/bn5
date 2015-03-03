import {DataSource} from './data-source';

export class Flat{
  static inject() { return [DataSource]; }
  constructor(dataSource){
    this.dataSource = dataSource;
    this.params = "";
  }

  activate(params, queryString, routeConfig) {
    this.id = params.id;
    console.log(this.id);
    console.log(this.dataSource.getData(this.id))
  }
}
