const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    evaluation: {
        type: String,
        enum: ['like', 'dislike']
    },
    content: {
        type: String,
        trim: true
    },
    lastChangedAt: {
        type: Date,
        default: Date.now
    }
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        unique: true,
        minLength: [10, 'Title should be longer than 10 characters']
    },
    theme: {
        type: String,
        required: true,
        enum: {
            values: ['trips', 'shopping', 'beauty', 'art', 'food'],
            message: '{VALUE} is not supported'
          }
    },
    description: {
        type: String,
        trim: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
    lastChangedAt: {
        type: Date,
        default: Date.now
    },
    comments: [commentsSchema]
}, {
    toJSON: { virtuals: true },
    virtuals: {
        likesQuantity: {
            get() {
                const commentArrayWithLikes = this.comments.filter((comment) => {
                    return comment.evaluation === 'like'
                });
                return commentArrayWithLikes.length;
            }
        },
        dislikesQuantity: {
            get() {
                const commentArrayWithDisikes = this.comments.filter((comment) => {
                    return comment.evaluation === 'dislike'
                });
                return commentArrayWithDisikes.length;
            }
        },
        rating: {
            get() {
                const commentsCount = this.comments.length || 1;
                const likesQuantity = this.likesQuantity;
                const dislikesQuantity = this.dislikesQuantity;
                return (likesQuantity - dislikesQuantity) / commentsCount + 1;
            }
        }
    }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

