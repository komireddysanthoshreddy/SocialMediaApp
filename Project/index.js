import path from 'node:path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from 'express'
import { readPosts, readUser, insertPost, insertUser, likeFun, shareFun, deleteFun } from './operations.js'
import bodyParser from 'body-parser'
import hbs from 'hbs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.set('view engine', 'hbs')

mongoose.connect("mongodb://127.0.0.1:27017/cinema", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const screen1Model = mongoose.model('screen1', {
    seatno: { type: Number },
    status: { type: String }
})

const screen2Model = mongoose.model('screen2', {
    seatno: { type: Number },
    status: { type: String }
})

const screen3Model = mongoose.model('screen3', {
    seatno: { type: Number },
    status: { type: String }
})

const moiesModel = mongoose.model('moies', {
    name: { type: String },
    rate: { type: Number },
    screenNo: { type: Number }
})

var screen1Res
screen1Model.find()
    .then(function (output) {
        screen1Res = output
    })
    .catch(function (err) {
        console.log(err)
    })

var screen2Res
screen2Model.find()
    .then(function (output) {
        screen2Res = output
    })
    .catch(function (err) {
        console.log(err)
    })

var screen3Res
screen3Model.find()
    .then(function (output) {
        screen3Res = output
    })
    .catch(function (err) {
        console.log(err)
    })


var moiesRes
moiesModel.find()
    .then(function (output) {
        moiesRes = output
    })
    .catch(function (err) {
        console.log(err)
    })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.get('/', (req, res) => {
    res.render("login")
})

app.get("/cinema", (req, res) => {
    res.render("cinema", {
        movies: moiesRes,
        screen1: screen1Res,
        screen2: screen2Res,
        screen3: screen3Res
    })
})

app.post('/login', async (req, res) => {
    const output = await readUser(req.body.profile)
    const password = output[0].password
    if (password === req.body.password) {
        const secret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc3N1ZXIgKGlzcykiOiJJc3N1ZXIiLCJJc3N1ZWQgQXQgKGlhdCkiOiIyMDIzLTEyLTMwVDEzOjUwOjUyLjU2NFoiLCJFeHBpcmF0aW9uIFRpbWUgKGV4cCkiOiIyMDIzLTEyLTMwVDE0OjUwOjUyLjU2NFoiLCJTdWJqZWN0IChzdWIpIjoiU3ViamVjdCIsIlVzZXJuYW1lIChhdWQpIjoiSmF2YUd1aWRlcyIsIlJvbGUiOiJBRE1JTiJ9.FQjZSPoJE0nh2b9DL9S1Erljg6dBs7Ea1TeeC3VDYoI"
        const payload = { "profile": output[0].profile, "name": output[0].name, "headline": output[0].headline }
        const token = jwt.sign(payload, secret)

        res.cookie("token", token)
        res.redirect("/posts")
    }
    else {
        res.send("Incorrect username or Password")
    }

})

app.get('/posts', verifyLogin, async (req, res) => {
    const output = await readPosts()
    res.render("posts", {
        data: output,
        userInfo: req.payload
    })
})

app.post('/like', async (req, res) => {
    await likeFun(req.body.content)
    res.redirect('./posts')
})


app.post('/share', async (req, res) => {
    await shareFun(req.body.content)
    res.redirect('./posts')
})

app.post('/delete', async (req, res) => {
    await deleteFun(req.body.content)
    res.redirect('./posts')
})
app.post('/addposts', async (req, res) => {
    await insertPost(req.body.profile, req.body.content)
    res.redirect('./posts')
})

function verifyLogin(req, res, next) {
    const secret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJc3N1ZXIgKGlzcykiOiJJc3N1ZXIiLCJJc3N1ZWQgQXQgKGlhdCkiOiIyMDIzLTEyLTMwVDEzOjUwOjUyLjU2NFoiLCJFeHBpcmF0aW9uIFRpbWUgKGV4cCkiOiIyMDIzLTEyLTMwVDE0OjUwOjUyLjU2NFoiLCJTdWJqZWN0IChzdWIpIjoiU3ViamVjdCIsIlVzZXJuYW1lIChhdWQpIjoiSmF2YUd1aWRlcyIsIlJvbGUiOiJBRE1JTiJ9.FQjZSPoJE0nh2b9DL9S1Erljg6dBs7Ea1TeeC3VDYoI"
    const token = req.cookies.token
    jwt.verify(token, secret, (err, payload) => {
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}


app.post('/addusers', async (req, res) => {
    if (req.body.password === req.body.cnfpassword) {
        await insertUser(req.body.name, req.body.profile, req.body.password, req.body.headline)
        res.redirect("/")
    } else {
        res.send("Password and Confrim Password did not match")
    }

})

app.get('/register', (req, res) => {
    res.render("register")
})
app.listen(3000, () => {
    console.log("Listening....")
})