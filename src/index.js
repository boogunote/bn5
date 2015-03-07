import {Behavior} from 'aurelia-framework';

export class Index {
  constructor() {
  }

  open(path) {
    console.log(path);
  }

  new(path) {
    console.log(path);
  }
}

export class SelectAttachedBehavior {
  static inject() { return [Element]; }
  constructor(element) {
    this.element = element;
  }

  bind(observer) {
    this.observer = observer;
    this.element.addEventListener('change', (event) => {
        this.observer[event.srcElement.id](this.element.value);
      });
  }
}
