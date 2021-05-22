import { Component } from '@angular/core';
import { Post } from './post';
import { POSTS } from './fake_posts';
import { BlogService } from './blog.service';
import * as cookie from 'cookie';

enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-blog';
  posts: Post[];
  // posts = POSTS.sort(function(a, b) { return a.postid - b.postid; }); //Set posts to be from the fake posts array
  currentPost:Post;
  AppStateEnum = AppState; //to use in the template
  state: number = 0; //0 is none, 1 is edit, 2 is preview
  appState: AppState = AppState.List; //enum
  cookies: { [key: string]: string; } = cookie.parse(document.cookie);
  jwt = parseJWT(this.cookies.jwt);
  username = this.jwt.usr;

  //Fetch all the initial posts
  constructor(private blogService: BlogService) {
    console.log("cookie: " + this.username);
    blogService.fetchPosts(this.username).then( (posts) => 
      {
      this.posts = posts
      .sort(function(a, b) { return a.postid - b.postid; }); })
      .catch(err => console.log(err));
  }

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

    //in database, add new post if postid is 0 or update existing
    this.blogService.setPost(this.username, post).then(ret_post => {this.currentPost = ret_post})
    .catch(err => console.log(err));
    this.blogService.fetchPosts(this.username).then((ret_posts) => 
    { 
      this.posts = ret_posts.sort(function(a, b) { return a.postid - b.postid; });
    })
      .catch(err => console.log(err));

    this.appState = AppState.Edit;
    this.state = 1;
  }

  //On delete should not show edit or preview
  deletePostHandler(post: Post){
    this.appState = AppState.List;
    this.state = 0;
    console.log("Delete post");
    this.blogService.deletePost(this.username, post.postid).catch(err => console.log(err));
    this.blogService.fetchPosts(this.username).then((ret_posts) => 
    { 
      this.posts = ret_posts.sort(function(a, b) { return a.postid - b.postid; });
    })
      .catch(err => console.log(err));
  }

  previewPostHandler(post: Post){
    this.appState = AppState.Preview;
    this.state = 2;
    console.log("Preview post");
    this.currentPost = post;
  }

  // event handlers for preview component events
  editPostHandler(post: Post){
    console.log("Edit post");
    this.currentPost=post;
    this.appState = AppState.Edit;
    this.state=1;
  }

}

function parseJWT(token) 
{
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}