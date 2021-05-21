import { Component } from '@angular/core';
import { Post } from './post';
import { POSTS } from './fake_posts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-blog';
  posts = POSTS.sort(function(a, b) { return a.postid - b.postid; }); //Set posts to be from the fake posts array
  currentPost:Post;

  openPostHandler(post: Post){
    console.log("Opened post: " + post.title + " " + post.postid);
    this.currentPost = post;
  }
  newPostHandler(){
    console.log("New Post!");
    const post:Post = new Post();
    this.currentPost = post;
  }
}
