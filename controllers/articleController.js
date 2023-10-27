const Article = require('../models/articleModel');
const { articleFilter } = require('./filter/articleFilter');

exports.getAllArticles = async (req, res) => {
    let result;

    Object.keys(req.query).length != 0 ?
        result = await articleFilter(req.query, Article) :
        result = await Article.find()

    const data = {
        status: "success",
        data: {
            "count": result.length,
            "articles": result
        }
    };
    res.status(200).json(data);
};

exports.getArticle = async (req, res) => {
    let article = await Article.findById(req.params.id);
    res.status(200).json(
        {
            "status": "success",
            "data": {
                "count": 1,
                "articles": [
                    article
                ]
            }
        }
    );
};

exports.postArticle = async (req, res) => {
    try {
        const {title, theme, description, comments} = req.body;
        const newDocument = new Article({
            title: title,
            theme: theme,
            description: description,
            comments: comments
        });

        // Save the new document to the MongoDB collection
        const savedDocument = await newDocument.save();

        res.status(201).json(savedDocument); // Return the saved document
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.patchArticle = async (res, req) => {
    const idToPatch = req.params.id;
    const updateFields = req.body;

    try {
        const updatedDocument = await Article.findByIdAndUpdate(
            idToPatch,
            updateFields,
            {new: true} // Set to true to return the updated document
        );

        if (!updatedDocument) {
            return res.status(404).json({message: 'Document not found'});
        }

        res.json({message: 'Document patched', updatedDocument});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

exports.deleteArticle = async (req, res) => {
    const idDelete = req.params.id;
    try {
        const deletedDocument = await Article.findByIdAndRemove(idDelete);
        if (!deletedDocument) {
            return res.status(404).json({message: 'Document not found'});
        }
        res.json({message: 'Document deleted', deletedDocument});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

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
