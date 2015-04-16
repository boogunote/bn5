// import the bundle file so that the bundler knows what our dependencies are
import './bundle';

import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {bootstrap} from 'aurelia-bootstrapper';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.levels.debug);

bootstrap(aurelia => {
  aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .router()
    .eventAggregator();

  aurelia.start().then(a => a.setRoot('dist/app', document.body));
});
