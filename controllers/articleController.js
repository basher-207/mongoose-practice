const Article = require('../models/articleModel');
const { articleFilter } = require('./filter/articleFilter');

exports.getAllArticles = async (req, res) => {
    if(Object.keys(req.query).length != 0){
        const filteredData = await articleFilter(req.query, Article);
        res.status(200).json(filteredData);
        return;
    }
};

exports.getArticle = async () => {};

exports.postArticle = async () => {};

exports.patchArticle = async () => {};

exports.deleteArticle = async () => {};

exports.threeMostLiked = async () => {};

exports.viewsCountByTheme = async () => {};
