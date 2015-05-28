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
              // window.location.href = "/#fm";
              // var hash = window.location.hash;
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
                  // window.location.href = "/#fm";
                  // window.location.href = window.location.origin + "/#fm";
                  that.router.navigate("mainwindow");
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
                      var new_tree_note_skeleton = that.utility.clone(that.common.new_tree_note_skeleton);
                      new_tree_note_skeleton.meta.create_time = Firebase.ServerValue.TIMESTAMP;
                      user_notes_skeleton.files[file_id] = new_tree_note_skeleton;
                      userNotesRef.set(user_notes_skeleton);
                      var userInfoRef = ref.child("info").child("users").child(userData.uid);
                      var user_info = {
                        email: email,
                        name: name,
                        time: Firebase.ServerValue.TIMESTAMP,
                        id: file_id
                      };
                      userInfoRef.set(user_info);
                      that.router.navigate("mainwindow");
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
// if (hash.length > 2) {
//     window.location.replace("index.html" + hash);
// } else {
//     window.location.replace("list.html");
// }
// window.location.href = window.location.origin + "/#fm";
// that.router.navigate("fm")
//# sourceMappingURL=data:application/json;base64,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