import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, Delete, Get } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostDto } from "./dtos/postDto";

@Controller('api/post')
export class PostController {
    constructor(private readonly postService: PostService) { }
    @Post()
    async create(@Body() createPostDto: PostDto): Promise<PostDto> {
        try {
            const createdPost = await this.postService.createPost(createPostDto,);
            return createdPost;
        } catch (error) {
            throw new HttpException('An error occurred while creating the post.', HttpStatus.BAD_REQUEST);
        }
    }
    @Put(':id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: PostDto): Promise<PostDto> {
        try {
            const updatedPost = await this.postService.updatePost(id, updatePostDto);
            return updatedPost;
        } catch (error) {
            throw new HttpException('Failed to update post.', HttpStatus.BAD_REQUEST);
        }
    }
    @Delete(':id')
    async deletePost(@Param('id') id: string): Promise<void> {
        try {
            await this.postService.deletePost(id);
        } catch (error) {
            throw new HttpException('Failed to delete post,' + error.message, HttpStatus.BAD_REQUEST);
        }
    }
    @Get()
    async getAllPosts(): Promise<PostDto[]> {

        return await this.postService.getAllPosts();

    }
}