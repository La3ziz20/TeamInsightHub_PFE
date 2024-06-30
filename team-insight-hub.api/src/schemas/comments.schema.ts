import * as mongoose from 'mongoose';
import { User } from './user.schema';



export const CommentSchema = new mongoose.Schema({
    postId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false })
CommentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
CommentSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export interface Comment extends mongoose.Document {
    id: string;
    postId: string;
    content: string;
    user: User;
    createdAt: Date;
}
