const express = require('express'),
	  router = express.Router(), 
	  User = require('../models/user'),
	  passport = require('passport');

//root route
router.get("/", (req, res) => {
    res.render("landing");
});

//AUTH Routes

//register new user form
router.get('/register', (req, res) => {
	res.render('register');
});

//create new user
router.post('/register', (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, registeredUser) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			return res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Account successfully created!')
			res.redirect('/campgrounds');
			});
		}
	});
});

//show login form
router.get('/login', (req, res) => {
	res.render('login');
});

//logic to login the user
router.post('/login',passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}), (req, res) => {
	res.send("you shouldn't be here :c");
})

//logic to logout the user
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', `Goodbye!`);
	res.redirect('/');
});

module.exports = router;