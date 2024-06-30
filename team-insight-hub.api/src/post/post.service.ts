import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "src/schemas/post.schema";
import { PostDto } from "./dtos/postDto";
import { mapPostEntityToDto } from "./mappers/post-mapper";
import { Comment } from "src/schemas/comments.schema";
import { CommentService } from "src/comment/comment.service";


export interface IPostService {
    createPost(createPostDto: PostDto): Promise<PostDto>;
    getAllPosts(): Promise<PostDto[]>;
    deletePost(id: string): Promise<void>;
    updatePost(id: string, updatePostDto: PostDto): Promise<PostDto>;
    addCommentToPost(comment: Comment): Promise<Post>

}
Injectable()
export class PostService implements IPostService {
    constructor(@InjectModel('Post') private readonly postModel: Model<Post>,
        @Inject(forwardRef(() => CommentService)) private readonly commentService: CommentService) { }

    public async createPost(createPostDto: PostDto): Promise<PostDto> {
        try {
            const newPost = new this.postModel({

                content: createPostDto.content,
                user: createPostDto.user.id,
                createdAt: new Date(),


            });
            const generatedPost = await newPost.save();
            return mapPostEntityToDto(generatedPost);
        } catch (error) {
            throw new BadRequestException('something went wrong'); // to create global error handling.. for resuability
        }
    }
    async deletePost(id: string): Promise<void> {
        try {
            const deletedPost = await this.postModel.findByIdAndDelete(id);
            if (!deletedPost) {
                throw new NotFoundException(`Can't find post with id ${id}`);
            }
            this.commentService.deleteCommentsByPostId(id);
        } catch (error) {
            throw new InternalServerErrorException("Failed to delete post");
        }

    }
    async updatePost(id: string, updatePostDto: PostDto): Promise<PostDto> {
        try {
            const existingPost = await this.postModel.findByIdAndUpdate(id, { content: updatePostDto.content }, { new: true });
            if (!existingPost) {
                throw new NotFoundException('Post not found.');
            }
            return existingPost.toJSON();
        } catch (error) {
            throw new BadRequestException('Failed to update post.');
        }
    }

    public async getAllPosts(): Promise<PostDto[]> {
        try {
            const posts = await this.postModel.find().populate('user')
                .populate({
                    path: 'comments',
                    populate: { path: 'user' }
                });
            const validatedPosts = posts.filter(post => {
                if (!post.user) {
                    console.warn(`Post with id ${post._id} has no user`);
                    return false;
                }
    
                if (post.comments) {
                    post.comments = post.comments.filter(comment => {
                        if (!comment.user) {
                            console.warn(`Comment with id ${comment._id} has no user`);
                            return false;
                        }
                        return true;
                    });
                }
    
                return true;
            });
    
            return validatedPosts.map(post => mapPostEntityToDto(post));
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            throw new BadRequestException('Failed to fetch posts. ' + error.message);
        }
    }
    
    deletePostByUserId(userId: string): void {
        this.postModel.deleteMany({ user: userId });
    }

    public async addCommentToPost(comment: Comment): Promise<Post> {
        const post = await this.postModel.findById(comment.postId).populate('comments');
        if (!post) {
            throw new NotFoundException(`Post with ID ${comment.postId} not found`);
        }
        post.comments.push(comment);
        const updatedPost = await this.postModel.findByIdAndUpdate(comment.postId, post, { new: true });

        return updatedPost;
    }
}