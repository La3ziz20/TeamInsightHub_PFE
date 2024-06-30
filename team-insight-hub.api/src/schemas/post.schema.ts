import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Comment } from './comments.schema';

export const PostSchema = new mongoose.Schema({

    content: { type: String, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }]
}, { versionKey: false })
PostSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
PostSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export interface Post extends mongoose.Document {
    id: string;
    content: string;
    user: User;
    createdAt: Date;
    comments: Comment[];
}
