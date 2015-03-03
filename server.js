//
//  SPORTS MANAGEMENT
//
//
//
//
//
//
//
// required modules
var path = require('path'),
	// load mongoose
	mongoose = require('mongoose'),
	// mongoose required order of operations:
	// require -> connect -> Schema -> Model -> route
	express = require('express'),
	app = module.exports = express(),
	bodyParser = require('body-parser'),
	io = require('socket.io'),
	server = app.listen(8000);

// start listening
var io = require('socket.io').listen(server, function() {
	console.log("Sports Team Manager - Listening on 8000, on the AM...oh yeah!");	
});

// require bodyParser since we need to handle post data for adding a user
app.use(bodyParser.urlencoded({ extended: true })); // stops deprication error as exended is false by default in new ver

// connet to mongodb and create collection
mongoose.connect('mongodb://localhost/sports_manager'); // basic_mongoose is name of DB in mongo

// create conneciton to database
var SportsSchema = new mongoose.Schema({
	email: String,
	password: String,
	firstName: String,
	lastName: String,
	sport: String,
	accessLevel: Number,
	myView: String,
	uniqueLoginId: String, // for refresh use on angular.
	timeOutuniqueLoginId: Date,
	logins: Number,
	createdAt: Date,
	modifiedAt: Date
})
SportsSchema.path('email').required(true, 'Email cannot be blank');
SportsSchema.path('password').required(true, 'Password cannot be blank');

// instantiate new mongoose model (db), and create if doesn't exist.
var Sport = mongoose.model('sporstinfo',SportsSchema);

// static content
app.use(express.static(path.join(__dirname, "client")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'ejs');

// set up glue between node and angular!
//app.use('app.router'); // needed to make partials work in angular, glues angular routes and node routes together.
app.route('/').get (function(req, res, next) {
		res.render('index');
	}); // points to index.ejs or is it .js
var partials = express.Router();
partials.get('/partals/:name', function(req, res, next) {

});
partials.use('/partials/:name', function(req, res, next) {partialName);

// 3.x way app.get('/partials/:name', router.partials); // make sure partials are recognized.

// makes all go to index (for )
// 3.x way ... app.get('*', router.index); // default. might have to catch 404 here.

//
//
//  router.all('*', requireAuthentication, loadUser); // look into this.  requires auth for all users. can load on each request
//
//
//  BTW, not the same as routes in angular to be specific. compliment each other.
// ***************************** ROUTES *****************************
// root route
router.get('/', function(req, res) {
	// This is where we would get the users from the database and send them to the index view to be displayed.
	res.render('index');
})

// route for showing quotes.
router.get('/getdata/:id', function(req, res) { // catch the href outside of the form. button in form will submit as post.
	Sport.find({}).sort({votes: 'desc'}).exec(function(err, quotes) {
		if(err) {
			console.log('BAM!');
			res.render('errors',{myerrs: err});
		} else {
			console.log('got data...rendering',quotes);
			res.render('show_quotes', {quotes: quotes });
		}
	})
})


router.get('/login', function(req, res) {
	redirect('users.ejs');
});

//
// route for showing quotes.
// don't need this until AFTER login!
router.get('/comeinside/:id', function(req, res) { // catch the href outside of the form. button in form will submit as post.
	var id = req.params.id;
	if (id=='login') {
		res.render('users', {firstpage: 'login' });
	} else if(id == 'profile') {
		res.render('users', {firstpage: 'updateprofile' });
	} else {
		res.render('users', {firstpage: 'registration' });
	}
});

//
//
// ROUTE - login established user. comes from partial for login id.
//
router.post('/login', function(req, res) {
	//console.log("POST DATA", req.body);
 	// This is where we would add the user from req.body to the database.
 	d = new Date();
 	var curdatetime = d.getTime();
 	
 	var email = req.body.email;
	var password = req.body.password;

	if(email.test(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) { // check email with regex for validity
		// we're good!! check passwords
		if(password != null && !password.length > 25) {
			res.render('errors', {myerr: 'The password was not a valid password.'}); // errors with password
		} else {
			loginUser(Sport, email, password); // login the user.
		}
	} else {
		res.render('errors', {myerr: 'Email was not a valid format.'}); // errors with password
	}
});

//
// ROUTE - register new user.
//
router.post('/register', function(req, res) {
	
 	d = new Date();
 	var curdatetime = d.getTime();
 	
 	var email = req.body.email;
	var passWord = req.body.password;
	var confirm = req.body.confirm;
	var firstName = req.body.firstName;
	var lastName = req.body.lastname;
	var title = req.body.title;
	var teamName = req.body.teamname; // can also be self --- ie golf, swimmers, track....
	var typeOfUser = req.body.usertype; // player/athlete - coach - parent - recruiter.
	var myView = req.body.myView;

	// do validation here too!
	// if not valid email.  should we email them and have them verify later? yes!
	if(email.test(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
		// we're good!! check passwords
		if(password == confirm && password != null && confirm != null) {
			// we're good, move on to next check.  these are seo for seperate error message that we might add together..maybe not.
			
			/// **************** CHANGE TO FIND() from FINDONE() cause the cursor is FAST! WAY FASTER!
			//now see if they've already registered! if they got the password with email we'll just log them in.
		 	Sport.sports_manager.find({ email: email, password: password }, function(err, user) {
				if (!err) {
					// found user, log them in.
					LoginUser(email, password);

				} else {	
				
					// create new user.

					d = new Date();
				 	thisDate = getTime();

				 	// ********** FUTURE CHANGE. validate by email before we do an auto login!
				 	// save this to DB with time for timeout. for dev we'll use 60 min timeout.
				 	var uniqueLoginId = getUniqueId();  // get 30 char unique id for this session....fake session id.
				 	var sessionTimeOut = d.getMinutes()+(1000 * 60 * 60); // add 60 minutes to now.

					// store all data in user object for MongoDB
					var myData = [{
						email: email,			// id to login with password
						password: passWord,
						firstname: firstName,
						lastname: lastName,
						title: title,			// title - coach, mom, dad, mr, mrs, etc.
						team: teamName,			// name of team or self!
						typeOfUser: typeOfUser,	// type of user
						myView: myView,			// view they want to land on.
						logins: 1,
						uniqueLoginId: uniqueLoginId,
						timeOutuniqueLoginId: sessionTimeOut,
						createdAt: thisDate,
						modifiedAt: thisDate }]

					// found, so log in user and set fake session id for identification.
					Sport.save(myData,function(err) { // actual insertion to DB here.
				 		if(err) {
				 			console.log('errors...');
				 			res.render('errors', {myerr: err});
				 		} else {
				 			console.log('all good - move along...');
				 			// page depends on who it is.
				 			setSessionID(uniqueLoginId, timeOutuniqueLoginId); // set the session id into session!?

				 			res.render(myView,{firstname: firstname, lastlogin: lastLoginDate });
				 		}
			 		})
			 	}

		 	});
		}
	}
})

//
// handle errors from angular!
//
router.get('/error/:id', function(req, res) {
	var errid = req.params.id;
	var err = '';
	switch (errid) {
		case 1:
			err = 'Error Logging in...';
			break;
	}
	res.render('errors', {myerr: err});
	console.log('error logging in...(server)');
});

// Handle votes here
// there is a qay to load data from database and make direct changes, and then resave without update.
router.get('/vote/:id', function(req, res) {
		// var myid = '_id: ObjectId("'+req.params.id+'")';
	 	Sport.findOne({ _id: req.params.id }, function(err, quote) {
			
			d = new Date();
		 	// sport.modifiedAt = d.getTime();
		 	
		 	var votes = sport.votes;
		 	votes++;
		 	// sport.votes = votes;
		
			Sport.update({ _id: req.params.id }, {$set: {votes: votes, modifiedAt: d.getTime()}},function(err) { // actual insertion to DB here.
		 		if(err) {
		 			console.log('errors...');
		 			res.render('errors', {myerr: err});
		 		} else {
		 			console.log('all good - move along...');
		 			res.redirect('/quotes');
		 		}
	 		})

	 	});
});

// removes quote from DJ
// there is a qay to load data from database and make direct changes, and then resave without update.
router.get('/destroy/:id', function(req, res) {
	// var myid = '_id: ObjectId("'+req.params.id+'")';
 	Sport.remove({ _id: req.params.id }, function(err, quote) {
		if(err) {
 			console.log('errors...');
 			res.render('errors', {myerr: err});
 		} else {
 			console.log('-----------------------------');
	 		console.log('Quote Removed');
	 		console.log('------------------------------');
 			res.redirect('/quotes');
 		}
 	});
});

io.sockets.on('connection', function(socket) {
	console.log('****** SOCKET LISTENER STARTED ******');
	console.log('* socket: '+socket.id);
	console.log('*************************************');

	// socket code here.
	io.sockets.on('connection', function(socket) {
		io.emit('my_emit_event', {response: 'Welcome to the Team Site!'});

	});

	// If you don't know where this code is supposed to go reread the above info 
	socket.on('button_clicked', function (data) {
    console.log('Someone clicked a button!  Reason: ' + data.reason);
    socket.emit('server_response', {response: 'Here we go!'});
	
	});
});


//
// MOVE this to exports. all functions OUT of here!
function getUniqueID() {
	var myString = '';
	for(var n=0; n<31; n++) {
		myString[n] = char(Math.floor(Math.random*(126-32)+1));
	}
}

function loginUser(Sport, email, password ) {

	d = new Date();
 	thisDate = getTime();

 	var logins = user.logins;
 	logins++;
 	// write
 	user.logins = logins; // set login times/ track usage.
 	var lastLoginDate = user.modifiedAt; // get first.
 	user.modifiedAt = thisDate; // set modified at time for last login.
 	// get
 	var myView = user.myView; // get the view this person will land on when logged in

 	// save this to DB with time for timeout. for dev we'll use 60 min timeout.
 	var uniqueLoginId = getUniqueId();  // get 30 char unique id for this session....fake session id.
 	var sessionTimeOut = d.getMinutes()+(1000 * 60 * 60); // add 60 minutes to now.
	
	// will have to change this because find() is order of magnitude faster than findone.
	Sport.findOne({ email: email, password: password }, function(err, user) {

		// found, so log in user and set fake session id for identification.
		Sport.update({ email: email, password: password }, {$set: {logins: logins, uniqueLoginId: uniqueLoginId, timeOutuniqueLoginId: sessionTimeOut,
modifiedAt: d.getTime()}},function(err) { // actual insertion to DB here.
	 		if(err) {
	 			console.log('errors...');
	 			res.render('errors', {myerr: err});
	 		} else {
	 			console.log('all good - move along...');
	 			// page depends on who it is.
	 			setSessionID(uniqueLoginId, timeOutuniqueLoginId); // set the session id into session!? beat refresh in angular.
	 			res.render(myView,{firstname: firstname, lastlogin: lastLoginDate });
	 		}
	 	})
	 });

}
// ************************************ SERVER
// listen on 8000

