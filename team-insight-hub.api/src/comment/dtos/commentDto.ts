import { UserDto } from "src/auth/dto/user.dto";

export interface CommentDto {
    id: string;
    postId: string;
    content: string;
    user: UserDto;
    createdAt: Date;
}