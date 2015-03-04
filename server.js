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
	app = express(),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	// io = require('socket.io'),
	server = app.listen(8000);

// start listening
// var io = require('socket.io').listen(server, function() {
// 	console.log("SportsUser Team Manager - Listening on 8000, on the AM...oh yeah!");	
// });

// require bodyParser since we need to handle post data for adding a user
app.use(bodyParser.urlencoded({ extended: true })); // stops deprication error as exended is false by default in new ver
// initialize session
app.use(session({secret: '2343-234-2-209864-345u09'})); // use some secret code for encryption key
var eSession;
var appSessionTimeout = 60; // in minutes

// connet to mongodb and create collection
mongoose.connect('mongodb://localhost/sports_manager'); // this is the NAME of our DB we are connecting to.

// create conneciton to database
var SportSchema = new mongoose.Schema({
	email: String,
	passWord: String,
	firstName: String,
	lastName: String,
	title: String,
	team: String,
	typeOfUser: String,
	myView: String,
	logins: Number,	
	uniqueLoginID: String, // for refresh use on angular.
	timeOutuniqueLoginID: Date, // also for refresh together with above
	createdAt: Date,
	modifiedAt: Date });

// SportSchema.path('email').required(true, 'Email cannot be blank');
// SportSchema.path('passWord').required(true, 'Password cannot be blank');

// instantiate new mongoose model (db), and create if doesn't exist.
var SportsUser = mongoose.model('SportsUser',SportSchema); // the argument sets the collection name for this db

// static content
app.use(express.static(path.join(__dirname, "client")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'ejs');

//
//  router.all('*', requireAuthentication, loadUser); // look into this.  requires auth for all users. can load on each request
//
//  BTW, not the same as routes in angular to be specific. compliment each other.
// ***************************** ROUTES *****************************
// root route
app.get('/', function(req, res) {
	// This is where we would get the users from the database and send them to the index view to be displayed.
	res.render('index');
})

// ROUTE - login
app.get('/loginuser', function(req, res) {
	res.redirect('users.html#/loginuser');
});
// ROUTE - profile - impliment later.  we'll show for now.
app.get('/profile', function(req, res) {
	res.redirect('users.html#/profile');
});
// ROUTE - profile - impliment later.  we'll show for now.
app.get('/coaches', function(req, res) {
	res.redirect('view.html#/coach');
});

//
// ROUTE - get user data and render proper view from the myView stored in DB
app.get('/getdata/:id', function(req, res) { // catch the href outside of the form. button in form will submit as post.
	SportsUser.find({uniqueLoginID: req.params.id}, function(err, user) {
		if(err) {
			console.log('BAM! Cannot get user info for redirect to their page.');
			res.render('errors',{myerrs: err});
		} else {
			console.log('got data...rendering',user);
			res.render(myView, user); // pass json data from DB into view.
		}
	});
});


//
//
// ROUTE - login established user. comes from partial for login id.
//
// app.post('/login', function(req, res) {
// 	//console.log("POST DATA", req.body);
//  	// This is where we would add the user from req.body to the database.
//  	d = new Date();
//  	var curdatetime = d.getTime();
 	
//  	var email = req.body.email;
// 	var password = req.body.password;

// 	if(email.test(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) { // check email with regex for validity
// 		// we're good!! check passwords
// 		if(password != null && !password.length > 25) {
// 			res.render('errors', {myerr: 'The password was not a valid password.'}); // errors with password
// 		} else {
// 			loginUser(Sport, email, password); // login the user.
// 		}
// 	} else {
// 		res.render('errors', {myerr: 'Email was not a valid format.'}); // errors with password
// 	}
// });
// would this work better as a call back. LoginUser(email, password, function(err, user) {});
// then, if err, we register. no err, we login and move on.
//
// ROUTE - register new user.
//
app.post('/login', function(req, res) {
	
	console.log('POST: ', req.body);

 	var confirm = '';
 	var firstName ='';
 	var lastName = '';
 	var typeOfUser = '';

 	// the only two "should be" guaranteed entry data points
 	var email = req.body.email;
	var passWord = req.body.password;

	if(!is_Empty(req.body.confirm)) {
		confirm = req.body.confirm;
	}
	if(!is_Empty(req.body.firstname)) {
		firstName = req.body.firstname;
	}
	if(!is_Empty(req.body.lastname)) {
		lastName = req.body.lastname;
	}
	//var title = req.body.title;
	//var teamName = req.body.teamname; // can also be self --- ie golf, swimmers, track....
	if(!is_Empty(req.body.usertype)) {
		typeOfUser = req.body.usertype; // player/athlete - coach - parent - recruiter.
	}
	//var myView = req.body.myView; // hard coded for now
	console.log('Got past all checks for blank data.');

// if not valid email.  should we email them and have them verify later? yes!
	var patt = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var regResult = patt.test(email);
	console.log('Email regEx is:', regResult);

	if(regResult) {

		if (passWord != null) {
			console.log('Email and password is good...');
			// try and login.  will return 99 if no good.

			// only do this check once with an email and password. too expensive to do more than once.
			// if user exists, the function will log them in and then redirect to correct page.
			if(!loginUser(email, passWord)) { // since we have email and password, attempt a login here. false if no exist

				console.log('User does not exist.  now go into rest of check');

				// are entered passwords the same?
				if(passWord == confirm && confirm != null) {
					console.log('Confirm matches password...');
							
					/// **************** CHANGE TO FIND() from FINDONE() cause the cursor is FAST! WAY FASTER!
					//now see if they've already registered! if they got the password with email we'll just log them in.
					// create new user.
					console.log('Good to go! Create new user.');

					d = new Date();
				 	thisDate = d.getTime();

				 	// ********** FUTURE CHANGE. validate by email before we do an auto login!
				 	// save this to DB with time for timeout. for dev we'll use 60 min timeout.
				 	var uniqueLoginID = getUniqueID();  // get 30 char unique id for this session....fake session id.
				 	var sessionTimeOut = d.getMinutes()+appSessionTimeout; // add 60 minutes to now.

				 	// hardcoded view for now.
					myView = 'coaches'; // ejs view
					title = 'Mr.';
					teamName = 'Newport Volleyball';
				
					// store all data in user object for MongoDB
					var myData = {	
						email: email,			// id to login with password
						passWord: passWord,
						firstName: firstName,
						lastName: lastName,
						title: title,			// title - coach, mom, dad, mr, mrs, etc.
						team: teamName,			// name of team or self!
						typeOfUser: typeOfUser,	// type of user
						myView: myView,			// view they want to land on.
						logins: 1,
						uniqueLoginID: uniqueLoginID,
						timeOutuniqueLoginID: sessionTimeOut,
						createdAt: thisDate,
						modifiedAt: thisDate };

					console.log('Save to database');
					// found, so log in user and set fake session id for identification.
					
					var sportsuser = new SportsUser(myData);
				 	console.log('mydata: ', myData);

					// sportsuser.save(function(err) { // actual insertion to DB here.
				 	sportsuser.save(function(err) { // actual insertion to DB here.
				 		
				 		if(err) {
				 			
				 			console.log('Could not save new user to database...');
				 			res.render('errors', {myerr: err});
				 		
				 		} else {

				 			console.log('No error in saving new user...redirecting to route: /'+myView);
				 			// page depends on who it is.
//***
				 			// not sure if we need to pass req here. try without??
				 			setMySessionID(req, uniqueLoginID, timeOutuniqueLoginID); // set the session id into session!?
				 			// want to use render to pass some data without loading from session or db
				 			res.redirect('/'+myView);
				 		}

			 		});
				}
			}
		}
	}
});

//
// handle errors passed to us from angular!
//
app.get('/error/:id', function(req, res) {
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

// ROUTE - Get user data here
// there is a qay to load data from database and make direct changes, and then resave without update.
app.get('/users/:id', function(req, res) {
	// id is session object id we created.  have to pull from session here
	// PULL ID FROM SESSION
	// 
 	SportsUser.find({ uniqueLoginID: req.params.id }, function(err, user) {

 		if(err) {
 			console.log('Error reading user data');
 			res.render('errors', {myerr: err});

 		} else {
 			// check timeout on session id.
 			// disable for dev mode.
 			var timeOut = user.timeOutuniqueLoginID;
 			d = new Date();
 			nowTime = d.getTime();
 			// ...blah blah, if timed out, we need to redirect to login page.

 			// we may need to parse url to reload where we were at.
 			console.log('Loading user for page view or refresh');
 			res.redirect(req.originalUrl); // go back to page we were on. may have to pull this from session, because originalurl may lead us to /getdata in a loop
 		}
	});
});

// removes quote from DJ
// there is a qay to load data from database and make direct changes, and then resave without update.
app.delete('/users/:id', function(req, res) {
	// var myid = '_id: ObjectId("'+req.params.id+'")';
 	SportsUser.remove({ _id: req.params.id }, function(err, quote) {
		if(err) {
 			console.log('errors...');
 			res.render('errors', {myerr: err});
 		} else {

 		}
 	});
});

// socket server - may not implement due to time.
// io.sockets.on('connection', function(socket) {
// 	console.log('****** SOCKET LISTENER STARTED ******');
// 	console.log('* socket: '+socket.id);
// 	console.log('*************************************');

// 	// socket code here.
// 	io.sockets.on('connection', function(socket) {
// 		io.emit('my_emit_event', {response: 'Welcome to the Team Site!'});

// 	});

// 	// If you don't know where this code is supposed to go reread the above info 
// 	socket.on('button_clicked', function (data) {
//     console.log('Someone clicked a button!  Reason: ' + data.reason);
//     socket.emit('server_response', {response: 'Here we go!'});
	
// 	});
// });

//
// FUNCTION - set session id and timeout
// simply ses session dependency on express-session - may get deprecated.
function setMySessionID(req, uniqueLoginID, timeOutuniqueLoginID) {
	eSession = req.session;
	eSession.fakeSessionID = uniqueLoginID;
	eSession.timeOut = timeOutuniqueLoginID;
}

//
// Pull session data. if timeOutuniqueLoginID is past time, we need to re-login.
// *** also fires on reload of page.
function checkLoginState() { // pass current res...
	
	var checkID = eSession.fakeSessionID;
	var checkTime = eSession.timeOut;
	var myFlag = false;

	// check against the database stored token. if found, then check time.  if time is expired, send to login.
	// otherwise we need to update the token's timeout in db.
	SportsUser.findOne({ uniqueLoginID: checkID }, function(err, user) {
		if(err) {
			// error so go to login page.
			myFlag = false;

		} else {

			var dbFakeSessionTimeOut = user.timeOutuniqueLoginID;
			if(d.getMinutes() - dbFakeSessionTimeOut.getMinutes() < appSessionTimeout) { // within timeout
				
				// set new timeout. based on server time. not users!
				var sessionTimeOut = d.getMinutes()+appSessionTimeout; // add 60 minutes to now.
				// set new timeout
				console.log('Setting NEW session timeout');
				SportsUser.update({ uniqueLoginID: checkID }, {$set: { timeOutuniqueLoginID: sessionTimeOut }}, function(err) {
					if(err) {
						// oops. something bad
						console.log('DB error updating session');
						myFlag = false;

					} else {
						console.log('Session Updated for user.')
						// worked well
						myFlag = true; // return true for the process to proceed.
					}
				});

			} else {
				// redirect to login.
				console.log('*** Session Timed out!');
				myFlag = false;
			}
		}
	}
	return myFlag;
}



// check if params are defined
function is_Empty(x) {
    if(typeof x === 'undefined' || x === null) {
    	return true;
    };
    return false;
}

//
// MOVE this to exports. all functions OUT of here!
function getUniqueID() {
	var myString = '';
	for(var n=0; n<31; n++) {
		myString += String.fromCharCode(64+Math.floor(Math.random() * 80 +1)); // random valid chars.
	}
	return myString;
}

//
// login the user. - move to methods.exports
//
function loginUser(email, passWord) {
	// return false if doesn't exist. otherwise login and forward.
	// called within a post so req & res exists outside already so we can use to pull post data and set res.

	console.log('Function loginUser...');

	var user = {};

	d = new Date();
 	thisDate = d.getTime();

	console.log('Trying findOne - email: '+email+', pw: '+passWord+' | slower but holds cursor open...');
	// will have to change this because find() is order of magnitude faster than findone.

	SportsUser.findOne({ email: email, passWord: passWord}, function(err, user) {
		
		if(err) {

			console.log('Could not find the user when logging in: '+err);
			return false;

		} else {

			console.log('err: '+err);
			console.log('Found user: '+user);

			var logins = user.logins;
		 	logins++;

		 	// put back into db
		 	user.logins = logins; // set login times/ track usage.
		 	
		 	var lastLoginDate = user.modifiedAt; // get first.
		 	user.modifiedAt = thisDate; // set modified at time for last login.
		 	// get
		 	var myView = user.myView; // get the view this person will land on when logged in

		 	// save this to DB with time for timeout. for dev we'll use 60 min timeout.
		 	var uniqueLoginID = getUniqueID();  // get 30 char unique id for this session....fake session id.
		 	var sessionTimeOut = d.getMinutes()+appSessionTimeout; // see definition in var def at begging of app.

			// found the user already. log em in and send them along
			// found, so log in user and set fake session id for identification.
			console.log('Updating session data in DB for this user before we login.');	
			
			SportsUser.update( { email: email, passWord: passWord }, {$set: {logins: logins, uniqueLoginID: uniqueLoginID, timeOutuniqueLoginID: sessionTimeOut,
modifiedAt: thisDate }}, function(err) { // update info for user.
	 			
	 			if(err) { // we have to check isFromRegister to determine if we login or are checking from register
	 				
	 				// somehow we are ending up here even after adding a new user.
	 				console.log('Could not log this user in and update login information.'); // we need to use a flag for how we entered this function.
	 				// cannot update.  prob shouldn't res.render

		 		} else  {
		 			console.log('Normal Login, all good - move along...');
		 		
		 			// page depends on who it is.
		 			setMySessionID(req, uniqueLoginID, timeOutuniqueLoginID); // set the session id into session!? beat refresh in angular.
		 			res.redirect('/'+myView);
		 			return true;
		 		}
	 		});
	 	}
	});
	return false
}
// ************************************ SERVER
// listen on 8000
console.log("\n\nSports Team Manager - Listening on 8000, on the AM...oh yeah!");
