import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import {users} from "./utils/constants.mjs"

const app = express();
app.use(cookieParser('hello world'));
app.use(express.json());
app.use(session({
  secret : "this is a secret",
  saveUninitialized: false,
  resave : false,
  cookie : {
    maxAge: 60000 *60,

  }

}))
app.use(routes); // import routes

const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  console.log(req.session)
  console.log(req.session.id)
  req.session.visited = true
  res.cookie("hello", "world", { maxAge: 10000, signed: true });
  res.status(201).send({ msg: "HEllo" });
});

// login
app.post('/api/auth', (req, res)=>{
  const {body: {username, password}} = req
  const findUser = users.find((user) => user.username === username)
  if(!findUser || findUser.password !== password)
     return res.status(401).send({msg: "BAD CREDENTIALS"})
  
  req.session.user = findUser //modifies the session object 
  return res.status(200).send(findUser)
  
})

// check authentication 
app.get('/api/auth/status', (req,res)=>{
  return req.session.user 
  ? res.status(200).send(req.session.user) 
  : res.status(401).send({msg: "Not Authenticated"})
})


app.post('/api/cart', (req, res)=>{
  if(!req.session.user)  return res.sendStatus(401)
    const { body: item } = req 
  
  const { cart } = req.session
  if(cart ){
    cart.push(item)
  }else{
    req.session.cart = [item];
  }
  return res.status(201).send(item)
})

app.get('/api/cart', (req, res)=>{
  if(!req.session.user) return res.sendStatus(401)
    return res.send(req.session.cart ?? [])
})

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
