var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index
router.get("/", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if(err) {
      res.flash("error", "Something went wrong...");
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds:campgrounds});
    }
  });
});

//Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  //get data from form and add to campground array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {name:name, price:price, image:image, description:description, author: author};
  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      res.flash("error", "Something went wrong...");
      console.log(err);
    } else {
      //redirect back to the campgrounds page
      res.redirect("/campgrounds");
    }
  });
});

//New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
})

//Show
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if(err || !foundCampground) {
      res.flash("error", "Something went wrong...");
      console.log(err);
      res.redirect("back");
    } else {
      res.render("campgrounds/show", {campground:foundCampground});
    }
  });
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      res.flash("error", "Something went wrong...");
      res.redirect("/campgrounds");
    } else {
    //update campground route
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.flash("error", "Something went wrong...");
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds")
    }
  });
});

module.exports = router;
