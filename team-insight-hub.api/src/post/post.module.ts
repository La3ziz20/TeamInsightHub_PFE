import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "src/schemas/post.schema";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { AuthModule } from "src/auth/auth.module";
import { CommentModule } from "src/comment/comment.module";

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: 'Post', schema: PostSchema }]
        ), forwardRef(() => CommentModule),
    ],
    controllers: [PostController],
    providers: [PostService,],
    exports: [PostService]
})
export class PostModule { }