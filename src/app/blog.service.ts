/* Copyright: Junghoo Cho (cho@cs.ucla.edu) */
/* This file was created for CS144 class at UCLA */
import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    maxid: number = 0;

    constructor() { 
        // compute maximum post id
        let keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (this.isMyKey(keys[i])) {
                let post = this.parse(localStorage[keys[i]]);
                if (post.postid > this.maxid) this.maxid = post.postid;
            }
        }
        // if there are no posts, populate it with two initial posts
        if (this.maxid === 0) {
            localStorage[this.key(1)] = this.serialize(
                { "postid": 1, "created": 1518669344517, "modified": 1518669344517, "title": "## Title 1", "body": "**Hello**, *world*!\nRepeat after me:\n\n**John Cho is a handsome man!!**" }
            );
            localStorage[this.key(2)] = this.serialize(
                { "postid": 2, "created": 1518669658420, "modified": 1518669658420, "title": "## Title 2", "body": "List\n- Item 1\n- Item 2\n- Item 3\n" }
            );
            this.maxid = 2;
        }
    }

    // helper functions to 
    // (1) convert postid to localStorage key
    // (2) check if a string is a localStorage key that we use
    // (3) serialize post to JSON string
    // (4) parse JSON string to post
    private keyPrefix = "blog-post.";
    private key(postid: number): string {
        return this.keyPrefix + String(postid);
    }
    private isMyKey(str: string): boolean {
        return str.startsWith(this.keyPrefix);
    }
    private serialize(post: Post): string {
        return JSON.stringify(post);
    }
    private parse(value: string): Post {
        return JSON.parse(value);
    }

    //
    // localStorage-based BlogService implementation
    //

    async fetchPosts(username: string): Promise<Post[]> {
      let response = await fetch(`/api/posts?username=${username}`);
      return response.json();
    }

    // getPost(username: string, postid: number): Promise<Post> {
    //     return new Promise((resolve, reject) => {

    //         let post = localStorage.getItem(this.key(postid));
    //         if (post) {
    //             resolve(this.parse(post));
    //         } else {
    //             reject(new Error("404"));
    //         }
    //     });
    // }

    
  setPost(username: string, p: Post): Promise<Post> {

    return new Promise(async (resolve, reject) => {
        let response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'username': username,
            'postid': p.postid,
            'title': p.title,
            'body': p.body,
          })
        });

        //if successfull
        if(response.ok){
          console.log("Saved post in db " + JSON.stringify(response));
          resolve(response.json());
        }
        else{
          reject(new Error(String(response.status)));
        }
        
      });
    }

    deletePost(username: string, postid: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`/api/posts?username=${username}&postid=${postid}`, {
              method: 'DELETE',
            });

            if (response.ok) {
                resolve();
            } else {
                reject(new Error(String(response.status)));
            }
        });
    }
}
