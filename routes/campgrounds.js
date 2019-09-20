const express = require('express'),
	  router = express.Router(),
	  Campground = require('../models/campground'),
	  middleware = require('../middleware');

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
   res.render("campgrounds/new"); 
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to campgrounds array
    const newCampground = req.body.campground
    // Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
			req.flash('error', err.message);
            res.redirect('back');
        } else {
			newlyCreated.author.id = req.user._id;
			newlyCreated.author.username = req.user.username;
			newlyCreated.save();
            //redirect back to campgrounds page
			req.flash('success', 'Campground successfuly created!')
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err || !foundCampground){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT - shows the edit form
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err || !foundCampground) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			res.render('campgrounds/edit', {campground: foundCampground});
		}
	})
});

//UPDATE - applies changes to campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			req.flash('success', 'Campground updated');
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

//DESTROY - delete a campground

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, removedCampground) => {
		if (err) {
			console.log(err)
			res.send('something went wrong');
		} else {
			Comment.deleteMany({_id: { $in: removedCampground.comments } }, (err) => {
				if (err) {
					console.log(err);
				}
			})
			req.flash('success', 'Campground deleted!');
			res.redirect('/campgrounds');
		}
	});
})

module.exports = router;