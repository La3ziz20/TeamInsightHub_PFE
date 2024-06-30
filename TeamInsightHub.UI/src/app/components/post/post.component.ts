import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/dtos/user.dto';
import { Post, Comment } from 'src/app/model/post';
import { CommentService } from 'src/app/services/comment.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PopupService } from 'src/app/services/popup.service';
import { PostService } from 'src/app/services/post.service';




@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})

export class PostComponent implements OnInit {


  postList!: Post[]

  newPostContent: string = '';
  currentUser!: UserDto;
  editMode: boolean = false;
  editCommentMode: boolean = false;
  editedPost!: Post;
  commentToEdit!: Comment;

  constructor(private postService: PostService,
    private popupService: PopupService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private commentService: CommentService,
    private elementRef: ElementRef) {
    this.currentUser = this.localStorageService.getUserInfo();
  }




  ngOnInit(): void {
    this.getAllPost();
  }
  getAllPost(): void {
    this.postService.getAllPosts().subscribe((posts: Post[]) => {
      this.postList = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }
  createPost(): void {
    if (this.newPostContent && this.currentUser) {
      const newPostData: Post = {
        id: '',
        content: this.newPostContent,
        user: this.currentUser,
        createdAt: new Date(),
        comments: []
      };

      this.postService.createPost(newPostData).subscribe(
        (createdPost: Post) => {

          console.log('Post created:', createdPost);

          this.newPostContent = '';
          this.getAllPost();
        },
        (error: any) => {
          console.error('Error creating post:', error);

        }
      );
    } else {
      console.error('Content or user is missing.');

    }
  }
  saveComment(post: Post): void {
    if (this.editCommentMode) {
      this.updateComment(post);
    }
    else {
      this.createComment(post);
    }
  }
  createComment(post: Post): void {
    if (post.newCommentContent && this.currentUser) {
      const newCommentData: Comment = {
        id: '',
        postId: post.id,
        content: post.newCommentContent,
        user: this.currentUser,
        createdAt: new Date(),

      };

      this.commentService.createComment(newCommentData).subscribe(
        (createdComment: Comment) => {

          this.getAllPost();
        },
        (error: any) => {
          console.error('Error creating commment:', error);

        }
      );
    } else {
      console.error('Content or user is missing.');

    }
  }

  getLowerInitials(user: UserDto): string {
    const firstNameLower = user.firstname.charAt(0).toLowerCase();
    const lastNameLower = user.lastname.charAt(0).toLowerCase();
    return `${firstNameLower}${lastNameLower}`.toUpperCase();
  }
  editPost(post: Post): void {
    this.editedPost = post;
    this.editMode = true;
    const editElement = this.elementRef.nativeElement.querySelector('#editPostElement');
    if (editElement) {
      editElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  updatePost() {
    this.postService.updatePost(this.editedPost.id, this.editedPost).subscribe(updatedPost => {
      this.getAllPost();
      console.log('Post édité :', updatedPost);
      this.editMode = false;
    }, (error: any) => {
      console.error('Error updating post:', error);
      this.toastr.error('Error updating post', error.message);
    });
  }
  editComment(post: Post, comment: Comment): void {
    post.newCommentContent = comment.content;
    this.editCommentMode = true;
    this.commentToEdit = comment;

    const commenntElement = this.elementRef.nativeElement.querySelector('#comment_' + post.id);
    if (commenntElement) {
      console.log(commenntElement)
      commenntElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }
  updateComment(post: Post) {
    this.commentToEdit.content = post.newCommentContent ?? this.commentToEdit.content;
    this.commentService.editComment(this.commentToEdit.id, this.commentToEdit).subscribe(updateComment => {
      this.getAllPost();
      console.log('Comment édité :', updateComment);
      this.editCommentMode = false;
    }, (error: any) => {
      console.error('Error updating comment:', error);
      this.toastr.error('Error updating comment', error.message);
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.editedPost = {} as Post;
    this.newPostContent = '';
  }
  cancelEditComment() {
    this.editCommentMode = false;
    this.commentToEdit = {} as Comment;
  }




  deletePost(postId: string) {
    this.popupService.confrim('Are you sure you want to delete this Post!!').then(confirmation => {
      if (confirmation) {
        this.postService.deletePost(postId).subscribe(() => {
          this.toastr.success('Post succrssfully deleted')
          this.getAllPost();

        }, error => {
          this.toastr.error('Error occurred while deleting the post', error);
        });
      }
    })

  }
  deleteComment(commentId: string) {
    this.popupService.confrim('Are you sure you want to delete this Comment!!').then(confirmation => {
      if (confirmation) {
        this.commentService.deleteComment(commentId).subscribe(() => {
          this.toastr.success('Comment succrssfully deleted')
          this.getAllPost();

        }, error => {
          this.toastr.error('Error occurred while deleting the comment', error);
        });
      }
    })

  }

}
