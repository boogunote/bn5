# bn5
Version 5 of BooguNote

Guide:

1. Create a free database in firebase.
2. Import boogu.json into firebase database.
3. Enable Email & Password Authentication in firebase database.
4. Set up an http server to host this project.
5. Import rule.json into firebase database.
6. Access http://your.domain/ to register a user name.
7. Login and enjoy it.

Build:

gulp build

jspm bundle file_manager/* + mosaic/* + common + data-source + flat + login + node + tree-node + tree-params + tree + utility + aurelia-bootstrapper + aurelia-http-client + aurelia-dependency-injection + aurelia-router dist/app-bundle.js --inject --minify

Notice: Before developing, you should invoke `jspm unbundle` to clean the js bundling.