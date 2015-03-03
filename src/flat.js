export class Flat{
  constructor(){
    // this.heading = 'Welcome to the Aurelia Navigation App!';
    // this.firstName = 'John';
    // this.lastName = 'Doe';
    this.params = "";
  }

  activate(params, queryString, routeConfig) {
    this.params = params.id;
    console.log(params.id);
  }
}
