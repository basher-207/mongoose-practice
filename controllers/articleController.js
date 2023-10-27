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
            count: result.length,
            articles: result
        }
    };
    res.status(200).json(data);
};

exports.getArticle = async (req, res) => {
    let article = await Article.findById(req.params.id);
    const data = {
        status: "success",
        data: {
            count: 1,
            article: article
        }
    };
    res.status(200).json(data);
};

exports.postArticle = async (req, res) => {
    try {
        const newDocument = new Article(req.body);
        // Save the new document to the MongoDB collection
        const savedDocument = await newDocument.save();

        const data = {
            status: "success",
            data: {
                count: 1,
                article: newDocument
            }
        };
        res.status(201).json(data); // Return the saved document
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.patchArticle = async (req, res) => {
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

        const data = {
            status: "success",
            data: {
                count: 1,
                article: updatedDocument
            }
        };
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteArticle = async (req, res) => {
    const idDelete = req.params.id;
    try {
        const deletedDocument = await Article.findByIdAndRemove(idDelete);
        if (!deletedDocument) {
            return res.status(404).json({message: 'Document not found'});
        }

        const data = {
            status: "success",
            data: {
                count: 1,
                article: deletedDocument
            }
        };
        res.status(204).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.threeMostLiked = async (req, res) => {
    const querys = {fields: 'title,comments,likesQuantity,dislikesQuantity'};
    const articles = await articleFilter(querys, Article);

    let result = articles.map((article) => {
        return article = {
            title: article.title,
            commentsCount: article.comments.length,
            rating: (article.likesQuantity - article.dislikesQuantity) / article.comments.length
        }
    });

    result.sort((a, b) => {
        return b.rating - a.rating || a.title.localeCompare(b.title);
    });

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
    const allArticles = await Article.find();
    const querys = {fields: 'theme'}
    const arrayOfThemesFields = await articleFilter(querys, Article);
    const arrayOfThemes = arrayOfThemesFields.map((el) => {
        return el.theme;
    });
    const themes = arrayOfThemes.filter((el, index) => {
        return arrayOfThemes.indexOf(el) === index;
    });

    const result = [];
    themes.forEach((theme) => {
        let a = {_id: theme , views: 0};
        allArticles.forEach((article) => {
            if(article.theme === theme){
                
                a.views += article.viewsCount;
                return;
            }
            return;
        });
        result.push(a);
    });

    result.sort((a, b) => {return b.views - a.views});

    const data = {
        status: "success",
        data: {
            count: result.length,
            result: result
        }
    };
    res.status(200).json(data);
};
