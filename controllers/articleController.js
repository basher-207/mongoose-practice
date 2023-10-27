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

exports.threeMostLiked = async (req, res) => {
    const querys = {fields: 'title,comments,likesQuantity,dislikesQuantity'};
    const articles = await articleFilter(querys, Article);

    let result = articles.map((article) => {
        return article = {
            title: article.title,
            commentsCount: article.comments.length,
            rating: (article.likesQuantity + article.dislikesQuantity) / article.comments.length
        }
    });

    result.sort((a, b) => {return b.rating - a.rating || a.title - b.title});

    if(req.query.limit){
        result = result.slice(0, req.query.limit);
    }

    const data = {
        status: "success",
        data: {
            count: result.length,
            result: result
        }
    }
    
    res.status(200).json(data);
};

exports.viewsCountByTheme = async (req, res) => {
    const querys = {fields: 'theme'}
    const arrayOfThemesFields = await articleFilter(querys, Article);
    const arrayOfThemes = arrayOfThemesFields.map((el) => {
        return el.theme;
    });
    const themes = arrayOfThemes.filter((el, index) => {
        return arrayOfThemes.indexOf(el) === index;
    })


    const allArticles = await Article.find();

    const result = [];
    themes.forEach((theme) => {
        let a = {_id: theme , views: 0};
        allArticles.forEach((article) => {
            if(article.theme === theme){
                a = {...a, views: a.views + article.comments.length};
                return;
            }
            return;
        });
        result.push(a);
    });

    const data = {
        status: "success",
        data: {
            count: result.length,
            result: result
        }
    }

    res.status(200).json(data);
};
