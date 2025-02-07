const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

router.post('/', async (req, res, next) => {
    try {
      const article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
      });
      req.article = await article.save();
      next();
    } catch (error) {
      console.error("Error saving the article:", error);
      res.status(400).send('Error saving the article: ' + error.message);
    }
  }, saveArticleAndRedirect('new'));
  
  
  

router.put('/:id', saveArticleAndRedirect('edit'))


router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req, res, next) => {
      let article = req.article || new Article(); 
      article.title = req.body.title;
      article.description = req.body.description;
      article.markdown = req.body.markdown;
      try {
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
      } catch (e) {
        res.render(`articles/${path}`, { article: article });
      }
    };
  }

  router.put('/toggle-trending/:id', async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).send({ message: 'Article not found' });
      }
      article.trending = !article.trending;
      await article.save();
      res.send({ message: 'Trending status updated', article });
    } catch (err) {
      console.error(err);
    }
  });
  

module.exports = router