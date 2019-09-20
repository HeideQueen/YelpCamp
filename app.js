const express     		  	= require("express"),
      app         		  	= express(),
      bodyParser  		  	= require("body-parser"),
	  methodOverride		= require('method-override'),
      mongoose    		  	= require("mongoose"),
	  flash					= require('connect-flash'),
	  passport 			  	= require('passport'),
	  LocalStrategy 		= require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
      Campground  		  	= require("./models/campground"),
      Comment    			= require("./models/comment"),
	  User					= require('./models/user'),
      seedDB      		  	= require("./seeds");

const campgroundsRoutes = require('./routes/campgrounds'), 
	  commentsRoutes = require('./routes/comments'),
	  indexRoutes = require('./routes/index');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
    
mongoose.connect("mongodb+srv://HeideQueen:iq6364bGNHQDrhsx@cluster0-ftlwk.mongodb.net/yelp-camp?retryWrites=true&w=majority");

app.use(flash());

app.use(require('express-session')({
	secret: 'akashi best ship',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//seedDB();

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log('Server is up nya!');
});