import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentSchema } from "src/schemas/comments.schema";
import { PostService } from "src/post/post.service";
import { PostModule } from "src/post/post.module";

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: 'Comment', schema: CommentSchema }]
        ), forwardRef(() => PostModule),
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule { }