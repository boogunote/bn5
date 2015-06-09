System.register(["firebase", "jquery", "./common", "./utility", "aurelia-framework", "aurelia-router"], function (_export) {
  var Common, Utility, Parent, Router, _createClass, _classCallCheck, Login;

  return {
    setters: [function (_firebase) {}, function (_jquery) {}, function (_common) {
      Common = _common.Common;
    }, function (_utility) {
      Utility = _utility.Utility;
    }, function (_aureliaFramework) {
      Parent = _aureliaFramework.Parent;
    }, function (_aureliaRouter) {
      Router = _aureliaRouter.Router;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Login = _export("Login", (function () {
        function Login(common, utility, router) {
          _classCallCheck(this, Login);

          this.common = common;
          this.utility = utility;
          this.router = router;
        }

        _createClass(Login, {
          login: {
            value: function login() {
              console.log("login");
              $("#btn-login").text("Waiting...");
              var that = this;
              var ref = new Firebase(this.common.firebase_url);
              ref.authWithPassword({
                email: $("#login-username").val(),
                password: $("#login-password").val()
              }, function (err, authData) {
                console.log(err);
                if (err) {
                  $("#btn-login").text("Login");
                  alert("Login Error: " + err.code);
                } else if (authData) {
                  // user authenticated with Firebase
                  console.log("Logged In! User ID: " + authData.uid);
                  that.router.navigate("main");
                  // if (hash.length > 2) {
                  //     window.location.replace("index.html" + hash);
                  // } else {
                  //     window.location.replace("list.html");
                  // }
                  var logoutTime = (authData.expires - 60 * 60) * 1000 - parseInt(new Date().getTime().toString());

                  setTimeout(function () {
                    if (confirm("Login expired. Go to login page or keep on this page?")) {
                      that.router.navigate("login");
                    }
                  }, logoutTime);
                }
              });
            }
          },
          onKeyDown: {
            value: function onKeyDown(event) {
              console.log(event);
              if (13 == event.keyCode) {
                this.login();
              };
              return true;
            }
          },
          signUp: {
            value: function signUp() {
              var ref = new Firebase(this.common.firebase_url);
              var email = $("#signup-email").val();
              var password = $("#signup-password").val();
              var name = $("#signup-name").val();
              var that = this;
              ref.createUser({
                email: email,
                password: password
              }, function (error, userData) {
                if (error) {
                  console.log("Error creating user:", error);
                } else {
                  console.log("Successfully created user account with uid:", userData.uid);
                  ref.authWithPassword({
                    email: email,
                    password: password
                  }, function (err, authData) {
                    console.log(err);
                    if (err) {
                      alert("Login Error: " + err.code);
                    } else if (authData) {
                      console.log("Logged In! User ID: " + authData.uid);
                      var userNotesRef = ref.child("notes").child("users").child(userData.uid);
                      var file_id = that.utility.getUniqueId();
                      var user_notes_skeleton = {
                        directories: {
                          nodes: {
                            root: {
                              id: "root",
                              children: [file_id]
                            }
                          }
                        },
                        files: {}
                      };
                      var file_item = {
                        id: file_id
                      };
                      user_notes_skeleton.directories.nodes[file_id] = file_item;
                      var new_flat_note_skeleton = that.utility.clone(that.common.new_flat_note_skeleton);
                      new_flat_note_skeleton.meta.id = file_id;
                      new_flat_note_skeleton.meta.create_time = Firebase.ServerValue.TIMESTAMP;
                      user_notes_skeleton.files[file_id] = new_flat_note_skeleton;
                      userNotesRef.set(user_notes_skeleton);
                      var userInfoRef = ref.child("info").child("users").child(userData.uid);
                      var user_info = {
                        email: email,
                        name: name,
                        time: Firebase.ServerValue.TIMESTAMP,
                        id: file_id
                      };
                      userInfoRef.set(user_info);

                      var timelineInfoRef = ref.child("timeline").child("users").child(userData.uid);
                      var user_timeline = {
                        data: {
                          "BN-default": {
                            first_item: {
                              content: "Welcome",
                              start: that.utility.now()
                            }
                          }
                        },
                        groups: {
                          "0": {
                            content: "default",
                            id: "BN-default"
                          }
                        }
                      };
                      timelineInfoRef.set(user_timeline);

                      that.router.navigate("main");
                    }
                  });
                }
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [Common, Utility, Router];
            }
          }
        });

        return Login;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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