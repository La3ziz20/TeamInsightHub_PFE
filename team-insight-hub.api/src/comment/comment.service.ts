import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CommentDto } from "./dtos/commentDto";
import { Comment } from "src/schemas/comments.schema";
import { Model } from "mongoose";
import { mapCommentEntityToDto } from "./mappers/comment-maper";
import { PostService } from "src/post/post.service";



export interface ICommentService {
    createComment(createCommentDto: CommentDto): Promise<CommentDto>;
    getCommentsByPostId(postId: string): Promise<CommentDto[]>;
    editComment(commentId: string, updateCommentDto: CommentDto): Promise<CommentDto>
}
Injectable()
export class CommentService implements ICommentService {
    constructor(@InjectModel('Comment') private readonly commentModel: Model<Comment>,
        @Inject(forwardRef(() => PostService)) private readonly postService: PostService) { }

    public async createComment(createCommentDto: CommentDto): Promise<CommentDto> {
        try {
            const newCommment = new this.commentModel({
                content: createCommentDto.content,
                postId: createCommentDto.postId,
                user: createCommentDto.user.id,
                createdAt: new Date(),
            });
            let generatedComment = await newCommment.save();
            generatedComment = await this.commentModel.findById(generatedComment.id).populate('user');
            await this.postService.addCommentToPost(generatedComment);
            return mapCommentEntityToDto(generatedComment);
        } catch (error) {
            throw new BadRequestException('something went wrong');
        }
    }
    public async getCommentsByPostId(postId: string): Promise<CommentDto[]> {
        try {
            const comments = await this.commentModel.find({ postId }).populate('user');
            return comments.map(comment => mapCommentEntityToDto(comment));
        } catch (error) {
            throw new BadRequestException('Something went wrong while fetching comments.');
        }
    }
    public async editComment(commentId: string, updateCommentDto: CommentDto): Promise<CommentDto> {
        try {
            const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, { content: updateCommentDto.content }, { new: true }).populate('user');
            if (!updatedComment) {
                throw new BadRequestException('Comment not found.');
            }
            return mapCommentEntityToDto(updatedComment);
        } catch (error) {
            throw new BadRequestException('Something went wrong while updating the comment.');
        }
    }
    public async deletComment(commentId: string): Promise<void> {
        try {
            const deletedComment = await this.commentModel.findByIdAndDelete(commentId);
            if (!deletedComment) {
                throw new BadRequestException('comment not found')
            }
        } catch (error) {
            throw new BadRequestException('Something went wrong while deleted the comment.');
        }
    }
    deleteCommentByUserId(userId: string): void {
        this.commentModel.deleteMany({ user: userId });
    }
    async deleteCommentsByPostId(postId: string): Promise<void> {
        try {

            await this.commentModel.deleteMany({ postId });
        } catch (error) {
            throw new BadRequestException('Failed to delete comments of post. ' + error.message);
        }
    }
}