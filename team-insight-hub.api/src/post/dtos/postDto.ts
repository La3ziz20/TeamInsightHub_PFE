import { UserDto } from "src/auth/dto/user.dto";
import { CommentDto } from "src/comment/dtos/commentDto";
import { User } from "src/schemas";

export interface PostDto {
    id: string;
    content: string;
    user: UserDto;
    createdAt: Date;
    comments: CommentDto[];
}