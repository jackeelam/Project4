import { Component } from '@angular/core';
import { Post } from './post';
import { POSTS } from './fake_posts';

enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-blog';
  posts = POSTS.sort(function(a, b) { return a.postid - b.postid; }); //Set posts to be from the fake posts array
  currentPost:Post;
  state: number = 0; //0 is none, 1 is edit, 2 is preview
  appState: AppState = AppState.List; //enum
  
  //List component handlers
  openPostHandler(post: Post){
    console.log("Opened post: " + post.title + " " + post.postid);
    this.currentPost = post;
    this.state = 1;
    this.appState = AppState.Edit;
  }
  newPostHandler(){
    console.log("New Post!");
    const post:Post = new Post();
    this.state = 1;
    this.appState = AppState.Edit;
    this.currentPost = post;
  }

  //Edit component handlers. Should call REST api to do the actions, but will do mock for now
  savePostHandler(post: Post){
    console.log("Saving post");
    //New post
    //Update modified time
    if(post.postid === 0){
      //Set created time
      post.postid = this.posts[this.posts.length-1].postid + 1;
      this.posts.push(post);
    }
    //Update existing post with same post id
    else{
      for (let i = 0; i < this.posts.length; i++) {
        //if the db post id matches the current one
        if(this.posts[i].postid === post.postid){
          console.log("Match");
          post.modified = new Date().getTime();
          this.posts[i] = post;
          // this.posts[i].title = post.title;
          // this.posts[i].body= post.body;
          // this.posts[i].modified = new Date().getTime();
        }
      }
    }
    this.currentPost = post;
    console.log(this.currentPost.modified);
    this.appState = AppState.Edit;
    this.state = 1;
  }

  //On delete should not show edit or preview
  deletePostHandler(post: Post){
    this.appState = AppState.List;
    this.state = 0;
    console.log("Delete post");
    this.posts = this.posts.filter(function(p){ 
      return p.postid !== post.postid;
    });
  }

  previewPostHandler(post: Post){
    this.appState = AppState.Preview;
    this.state = 2;
    console.log("Preview post");
    this.currentPost = post;
  }

  editPostHandler(post: Post){
    console.log("Edit post");
    this.currentPost=post;
    this.appState = AppState.Edit;
    this.state=1;
  }


}
