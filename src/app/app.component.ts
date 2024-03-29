import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error: string = '';
  
  private errSub: Subscription = new Subscription;
  
  constructor(private http: HttpClient, private postService: PostsService) {}
  
  ngOnInit() {
    this.errSub = this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postService.fetchPost()
      .subscribe(posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }, error => {
        this.error = error.message;
    });
  }
  
  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
  }
  
  onFetchPosts() {
    this.postService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });
    
    this.isFetching = true;
    this.postService.fetchPost().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }
  
  onClearPosts() {
    // Send Http request
    this.postService.deletePosts()
    .subscribe(() => {
      this.loadedPosts = [];
    }, error => {
      this.error = error.message;
    });
  }
  
  onHandlerError(){
    this.error = '';
  }

  ngOnDestroy(): void {
    this.errSub.unsubscribe();
  }
  
}
