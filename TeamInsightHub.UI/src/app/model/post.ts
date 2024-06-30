import { UserDto } from "../dtos/user.dto";

export interface Post {
    id: string;
    content: string;
    user: UserDto;
    createdAt: Date;
    comments: Comment[];
    newCommentContent?: string;
}

export interface Comment {
    id: string;
    postId: string;
    content: string;
    user: UserDto;
    createdAt: Date;
}