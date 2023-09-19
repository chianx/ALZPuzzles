import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var login = false;

mongoose.connect("mongodb+srv://admin-chianx:narutois1@cluster0.pdq0h.mongodb.net/alzdb", {useNewUrlParser: true, useUnifiedTopology: true});

var uName = "";

class Score {
    constructor(date, score, count) {
        this.date = date;
        this.score = score;
        this.count = count;
    }
}

const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required: [true, "name is necessary"]
    },    
    email : {
        type :String,
        required: [true, "email is necessary"]
    },    
    username : {
        type :String,
        required: [true, "username is necessary"]
    },    
    password : {
        type :String,
        required: [true, "type a password"]
    },    
    dob : {
        type :Date,
        required: [true, "birthdate is necessary"]
    },
    simon : {
        type: Array
    },
    card : {
        type: Array
    }
    
});

const User = new mongoose.model("User" ,userSchema);

function todaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return (dd + '/' + mm + '/' + yyyy);
}

app.get("/", function(req, res) {
    res.json({message: "Hekllo from serveer"})
    // res.render("index");
    console.log(req.body.required);
    console.log("thats it");
});

app.get("/login", function(req, res) {
    res.render("login", {errorMessage: ""});
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, function(err, result) {
        if (result != null) {
            if (result.password === password) {
                uName = username;
                res.redirect("/report/" + username);
            }else {
                res.render("login", {errorMessage: "*Password is incorrect, please try again*"});
            }
        }else {
            res.render("login", {errorMessage: "*Username does not exist*"});
        }
    })
});

app.get("/signup", function(req, res) {
    res.render("signup", {errorMessage: ""});
});

app.post("/signup", function(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const pass1 = req.body.pass1;
    const pass2 = req.body.pass2;

    let errorMsg = "";

    User.find({email: email}, function(err, resEmail) {
        if (resEmail.length === 0) {
            User.find({username: username}, function(err, resUSername ) {
                if (resUSername.length === 0) {
                    if (pass1 === pass2) {

                        const newUser = new User({
                            name : req.body.name,
                            email : email,
                            username : username,
                            password : pass1,
                            dob : req.body.dob
                        });

                        newUser.save();
                        console.log("*user successfully added*");
                        res.render("index");

                    }else {
                        errorMsg = "*Passwords does not match*";res.render("signup", {errorMessage: errorMsg});
                    }
                }else {
                    errorMsg = "*This username already exist*";res.render("signup", {errorMessage: errorMsg});
                }
            });
        }else {
            errorMsg = "*You already have an account with this email*";
            res.render("signup", {errorMessage: errorMsg});
        }
    });
});

app.post("/scores", function(req, res) {
    let avgScore = req.body.averageScore;
    console.log("newSvore = " + avgScore);
    var today = todaysDate(); //dd/mm/yyyy
    uName = req.body.username;
    User.find({username: uName}, function(err, result) {
        if(err) {
            console.log(err);
        }else {
            if (result[0].simon.length === 0 || result[0].simon[result[0].simon.length-1].date != today) {
                var score = new Score(today, parseFloat(avgScore), 1);
                result[0].simon.push(score);
            }else {
                var c = result[0].simon[result[0].simon.length-1].count++;
                var s = result[0].simon[result[0].simon.length-1].score;
                s = s*c; s += parseFloat(avgScore);
                s = s/(c+1);
                result[0].simon[result[0].simon.length-1].score = s;
            }
            console.log(result[0].simon);
        }
        User.updateOne({username: uName}, {simon: result[0].simon}, {new: true}, function(err, done) {
            if (err) {
                console.log(err);
            }
        })
    });
    res.render("simon", {username: uName});

});

app.post("/cardScore", function(req, res) {
    let avgScore = req.body.averageScore;
    console.log("newScore = " + avgScore);
    var today = todaysDate(); //dd/mm/yyyy
    uName = req.body.username;
    console.log("username = " +uName);
    User.find({username: uName}, function(err, result) {
        if(err) {
            console.log(err);
        }else {
            if (result[0].card.length === 0 || result[0].card[result[0].card.length-1].date != today) {
                var score = new Score(today, parseFloat(avgScore), 1);
                result[0].card.push(score);
            }else {
                var c = result[0].card[result[0].card.length-1].count++;
                var s = result[0].card[result[0].card.length-1].score;
                s = s*c; s += parseFloat(avgScore);
                s = s/(c+1);
                result[0].card[result[0].card.length-1].score = s;
            }
            console.log(result[0].card);
        }
        User.updateOne({username: uName}, {card: result[0].card}, {new: true}, function(err, done) {
            if(err) {
                console.log(err);
            }
        });
        res.render("card", {username: uName});
    }); 
});

app.get("/report/:username", function(req, res) {

    User.find({username: req.params.username}, function(err, result) {
        if (err) {
            console.log(err);
        }else if (result.length >0) {
            var simonArr = [];
            var cardArr = [];
            var simonDate = [];
            var cardDate = [];
            for(var i=0; i<result[0].simon.length; i++) {
                simonArr[i] = result[0].simon[i].score;
                simonDate[i] = result[0].simon[i].date;
                console.log(simonDate);
            }
            for(var i=0; i<result[0].card.length; i++) {
                cardArr[i] = result[0].card[i].score;
                cardDate[i] = result[0].card[i].date;
                console.log(cardDate);
            }
            res.render("report", {username: req.params.username, simonScore: simonArr, cardScore: cardArr, cardDate: cardDate, simonDate: simonDate,  name: result[0].name});
        }else {
            res.send("Username does not exist");
            console.log(req.params.username);
        }
    });

});

app.get("/simon/:username", function(req, res) {
    res.render("simon", {username: req.params.username});
});

app.get("/turn-a-card/:username", function(req, res) {
    res.render("card", {username: req.params.username});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log("Server started succesfully");
});