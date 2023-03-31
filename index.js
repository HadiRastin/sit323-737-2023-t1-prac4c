const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const app = express();
//app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());


const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'cloud native'
}, (jwtPayload, done) => {
    const user = { id: jwtPayload.id };
    done(null, user);
}));

const users = [
    {id: 1, username: "john", email: "john@gmail.com", password:'123'}, 
    {id: 2, username: "hadi", email: "hadi@gmail.com", password: '1234'},
    {id: 3, username: "sara", email: "sara@gmail.com", password: '12345'}
  ];
  
  


app.get("/register", (req, res) => {

    res.sendFile('./views/register.html', { root: __dirname });
  
});

app.get("/login", (req, res) => {

    res.sendFile('./views/login.html', { root: __dirname });
  
});



app.get('/testauth', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
        }
    })
})

app.post("/login", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
  
    const foundUser = users.find(user => user.username === req.body.username && user.password === req.body.password);
    if (foundUser) {
      console.log('I am in the if')
      const token = jwt.sign({ id: req.body.username}, "cloud native", { expiresIn: "1d" });
      console.log(token)
      return res.status(200).send({success: true,message: "Logged in successfully!",token: "Bearer " + token})
    }
    return res.status(401).send({success: false,message: "Could not find the user."})
  });
  





app.post('/register', (req, res) => {
    const { username, email, password } = req.body.username;
    
    const existingUser = users.find(user => user.username === username || user.email === email);
    
    if (existingUser) {
      return res.status(400).send({ success: false, message: 'Username or email already exists' });
    }
    
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password
    };
    users.push(newUser);
    res.status(201).send({ success: true, message: 'User registered successfully', user: newUser });
  });
  
  

app.listen(3000, () => console.log("Server is runing"));