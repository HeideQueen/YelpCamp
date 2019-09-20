const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};


//check if user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You must be logged in to do that!');
	res.redirect('/login');
};

//check if logged in user is owner of the campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err || !foundCampground) {
				console.log(err);
				req.flash('error', 'Campground not found!');
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash('error', 'You are not the owner of this campground!');
					res.redirect('back');
				}
			}
		})
	} else {
		req.flash('error', 'You need to be logged in to do that!');
		res.redirect('back');
	}
};


//check if logged in user is the owner of the comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err || !foundComment) {
				console.log(err);
				req.flash('error', 'Comment not found!')
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					return next();
				} else {
					req.flash('error', 'You are not the owner of this comment!')
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do this!');
		res.redirect('back');
	}
}

module.exports = middlewareObj;