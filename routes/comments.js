const express = require('express'),
	  router  = express.Router({mergeParams: true}),
	  Campground = require('../models/campground'),
	  Comment = require('../models/comment'),
	  middleware = require('../middleware');

// post new comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// create comment
router.post("/", middleware.isLoggedIn, (req, res) => {
   //lookup campground using ID
   Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, (err, comment) => {
           if(err){
               console.log(err);
			   req.flash('error', err.message);
			   res.redirect('back');
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               campground.comments.push(comment);
               campground.save();
			   req.flash('success', 'Comment added!');
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// show edit form 

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err || !foundComment) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('comments/edit', {campgroundId: req.params.id, comment: foundComment});
		}
	});
});

// update comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			req.flash('success', 'Comment updated');
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

// delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, removedComment) => {
		if (err) {
			console.log(err);
			res.send('something went wrong!');
		} else {
			req.flash('success', 'Comment deleted!');
			res.redirect(`/campgrounds/${req.params.id}`)
		}
	})
})

module.exports = router;