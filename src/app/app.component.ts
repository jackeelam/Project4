import { Component } from '@angular/core';
import { POSTS } from './fake_posts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-blog';
  posts = POSTS; //Set posts to be from the fake posts array
}
