let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000*1000 }, resave: true, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



let users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.put('/login', (req, res) => {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	var sess = req.session;
	let find = false;
	let ID = req.body.id;
	let Password = req.body.password;
	users.forEach(user => {
		if(user["userId"] == ID){
			if(user["password"] == Password){
				sess.userId = user["userId"];
				sess.isAdmin = user["isAdmin"];
				find = true;
			}
		}
	});
	console.log("Find is done.");

	if(find){
		res.send("Login");
	}
	else{
		res.send("Can't find");
	}
});

app.put('/logout', (req, res) => {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	if(req.session.userId != null){
		req.session.userId = null;
		req.session.isAdmin = null;
		res.send("LogOut");
	}
	else{
		res.send("Err. Not Login");
	}
});

let auth = (req, res, next) => {
	// Session Check
	// 어드민 여부 체크 필요
	if(req.session.isAdmin){
		if (req.session.userId != null)
		next();
		else
			res.send("Error");
	}
	else{
		res.send("Error");
	}
};

app.get('/users/:userId', auth, (req, res) => {
	// get User Information
	let find = false;
	users.forEach(user => {
		if(user["userId"] == req.params.userId){
			res.send(user);
			find = true;
		}
	});
	console.log("Find is done.");

	if(!find){
		res.send("Can't find");
	}
});

app.put('/users', auth, (req, res) => {
	// Update User information
	let userId = req.body.id;
	let find = false;
	let count = 0;
	users.forEach(user => {
		if(user["userId"] == userId){
			users[count] = {
				"userId" : req.body.id,
				"name" : req.body.name,
				"password" : req.body.password,
				"isAdmin" : req.body.isAdmin};
			res.send(users[count]);
			find = true;
		}
		else{
			++count;
		}
	});
	console.log("Find is done.");

	if(!find){
		res.send("Can't find");
	}
})

app.post('/users', auth, (req, res) => {
	// Post User information
	let isfind = false;
	let count = 0;
	users.forEach(user => {
		if(user[0] == '\0'){
			users[count] = {
				"userId" : req.body.id,
				"name" : req.body.name,
				"password" : req.body.password,
				"isAdmin" : req.body.isAdmin};
			res.send(users[count]);
			isfind = true;
		}
		else{
			++count;
		}
	});
	console.log("Find is done.");

	if (!isfind){
		users[users.length] = {
			"userId" : req.body.id,
			"name" : req.body.name,
			"password" : req.body.password,
			"isAdmin" : req.body.isAdmin};
		res.send(users[(users.length - 1)]);
	}
})

app.delete('/users/:userId', auth, (req, res) => {
	// Delete User information
	let userId = req.params.userId;
	let find = false;
	let count = 0;
	users.forEach(user => {
		if(user["userId"] == userId){
			users[count] = ['\0'];
			res.send(users[count]);
			find = true;
		}
		else{
			++count;
		}
	});
	if(!find){
		res.send("Can't find");
	}
})

// 사용자 추가 시에 admin 여부도 추가해야 함

let server = app.listen(23013);
