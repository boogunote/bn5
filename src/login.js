import 'firebase';
import 'jquery';
import {Common} from './common';
import {Utility} from './utility';
import {Parent} from 'aurelia-framework';
import {Router} from 'aurelia-router';

export class Login {
  static inject() { return [Common, Utility, Router]; }
  constructor(common, utility, router){
    this.common = common;
    this.utility = utility;
    this.router = router;
  }

  login() {
    console.log("login");
    $('#btn-login').text('Waiting...')
    // window.location.href = "/#fm";
    // var hash = window.location.hash;
    var that = this;
    var ref = new Firebase(this.common.firebase_url);
    ref.authWithPassword({
      email    : $("#login-username").val(),
      password : $("#login-password").val()
    }, function(err, authData) {
      console.log(err);
      if (err) {
        alert("Login Error: " + err.code);
      } else if (authData) {
        // user authenticated with Firebase
        console.log("Logged In! User ID: " + authData.uid);
        // window.location.href = "/#fm";
        // window.location.href = window.location.origin + "/#fm";
        that.router.navigate("fm")
        // if (hash.length > 2) {
        //     window.location.replace("index.html" + hash);
        // } else {
        //     window.location.replace("list.html");
        // }
      }
    });
  }

  onKeyDown(event) {
    console.log(event)
    if (13 == event.keyCode) {
      this.login();
    };
    return true;
  }

  signUp() {
    var ref = new Firebase(this.common.firebase_url);
    var email = $("#signup-email").val();
    var password = $("#signup-password").val();
    var name = $("#signup-name").val();
    var that = this;
    ref.createUser({
      email    : email,
      password : password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        ref.authWithPassword({
          email    : email,
          password : password
        }, function(err, authData) {
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
                    children: [
                      file_id
                    ]
                  }
                }
              },
              files: {}
            };
            var file_item = {
              id: file_id
            }
            user_notes_skeleton.directories.nodes[file_id] = file_item;
            var new_tree_note_skeleton = that.utility.clone(that.common.new_tree_note_skeleton)
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
            window.location.href = window.location.origin+"/#fm";
            // window.location.href = window.location.origin + "/#fm";
            // that.router.navigate("fm")
          }
        });
      }
    });
  }
}