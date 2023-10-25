const express = require('express');

//define routes for articles here (for get, post, patch and delete requests)
//use exspress Router
//articleController.checkArticle should be called before articleController.postArticle
//articleController.checkId should be called first for routes with id parameter
const articleController = require('../controllers/articleController');

const router = express.Router();

router
  .route('/')
  .get(articleController.getAllArticles)
  .post(articleController.postArticle);
router.route('/most-liked').get(articleController.threeMostLiked);
router.route('/views-by-theme').get(articleController.viewsCountByTheme);
router
  .route('/:id')
  .get(articleController.getArticle)
  .patch(articleController.patchArticle)
  .delete(articleController.deleteArticle);

module.exports = router;
