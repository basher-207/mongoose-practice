const Article = require('../models/articleModel');

exports.getAllArticles = async (req, res) => {
    let articles = await Article.find().where(req.query);
    try {
        const {title, theme, description, viewsCount, lastChangedAt} = req.query; // Assuming parameters are in the query string

        // Build the query based on the request parameters
        const query = {};

        if (title) {
            query.title = title;
        }

        if (theme) {
            query.theme = theme;
        }

        if (description) {
            query.description = description;
        }
        if (viewsCount) {
            query.viewsCount = viewsCount;
        }
        if (lastChangedAt) {
            query.lastChangedAt = lastChangedAt;
        }
        const filteredData = await Article.find(query);
        const count = await Article.find(query).count()
        res.status(200).json({
            "status": "success",
            "data": {
                "count": count,
                "articles": [
                    filteredData
                ]
            }
        });
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}

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

exports.threeMostLiked = async () => {
};

exports.viewsCountByTheme = async () => {
};
