
import { Post } from 'src/schemas/post.schema';
import { PostDto } from '../dtos/postDto';
import { mapCommentEntityToDto } from 'src/comment/mappers/comment-maper';
import { mapUserEntityToUserDto } from 'src/auth/mapper/user-mapper';

export function mapPostEntityToDto(post: Post): PostDto {
    return {
        id: post.id,
        content: post.content,
        user: mapUserEntityToUserDto(post.user),
        createdAt: post.createdAt,
        comments: post.comments.map(comment => mapCommentEntityToDto(comment))

    };
}
