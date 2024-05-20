require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const connectDB = require('./server/db')
const methodOverride = require('method-override')
const app = express()

const PORT = process.env.PORT || 5000;


connectDB();

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'));


app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})


app.use('/articles', articleRouter)

app.listen(5000)