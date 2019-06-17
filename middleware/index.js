var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in first!");
  res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  //is the user logged in?
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err || !foundComment) {
        res.flash("error", "Comment not found.");
        res.redirect("back")
      } else {
        //does the user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.flash("error", "Only the comment owner can do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    res.flash("error", "Only the comment owner can do that.");
    res.redirect("back");
  }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  //is the user logged in?
  if(req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if(err || !foundCampground) {
        res.flash("error", "Campground not found.");
        res.redirect("back")
      } else {
        //does the user own the campground?
        if(foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.flash("error", "Only the campground owner can do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    res.flash("error", "Only the campground owner can do that.");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
