var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments routes
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(rew.params.id, function(err, foundCampground) {
    if(err || !foundCampground) {
      req.flash("error", "No campground found.");
      return res.redirect("back");
    } else {
      Campground.findById(req.params.id, function(err, campground) {
        if(err) {
          res.flash("error", "Something went wrong...");
          console.log(err);
        } else {
          res.render("comments/new", {campground:campground});
        }
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      res.flash("error", "Something went wrong...");
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          res.flash("error", "Something went wrong...");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.flash("success", "Successfully added a comment.");
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
  });
});

//update comments
router.put("/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.flash("error", "Something went wrong...");
      res.redirect("back");
    } else {
    //update comment route
      res.flash("success", "Successfully updated your comment.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      res.flash("error", "Something went wrong...");
      res.redirect("back");
    } else {
      res.flash("success", "Successfully deleted your comment.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
