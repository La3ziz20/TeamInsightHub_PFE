import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentDto } from "./dtos/commentDto";

@Controller('api/comment')
export class CommentController {
    constructor(private readonly CommentService: CommentService) { }
    @Post()
    async create(@Body() createCommentDto: CommentDto): Promise<CommentDto> {
        try {
            const createdComment = await this.CommentService.createComment(createCommentDto,);
            return createdComment;
        } catch (error) {
            throw new HttpException('An error occurred while creating the comment.', HttpStatus.BAD_REQUEST);
        }
    }
    @Put(':id')
    async updateComment(@Param('id') commentId: string, @Body() updateCommentDto: CommentDto): Promise<CommentDto> {
        try {
            const updatedComment = await this.CommentService.editComment(commentId, updateCommentDto);
            if (!updatedComment) {
                throw new NotFoundException('Comment not found.');
            }
            return updatedComment;
        } catch (error) {
            throw new NotFoundException('Comment not found.');
        }
    }
    @Delete(':id')
    async deleteComment(@Param('id') commentId: string): Promise<void> {
        try {
            await this.CommentService.deletComment(commentId);
        } catch (error) {
            throw new NotFoundException('Comment not found.');
        }
    }
    @Get('/postID/:postId')
    async getCommentsByPostId(@Param('postId') postId: string): Promise<CommentDto[]> {
        return this.CommentService.getCommentsByPostId(postId);
    }

}