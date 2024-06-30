import { Comment } from 'src/schemas/comments.schema';
import { CommentDto } from '../dtos/commentDto';
import { mapUserEntityToUserDto } from 'src/auth/mapper/user-mapper';

export function mapCommentEntityToDto(comment: Comment): CommentDto {
    return {
        id: comment.id,
        postId: comment.postId,
        content: comment.content,
        user: mapUserEntityToUserDto(comment.user),
        createdAt: comment.createdAt
    };
}
