import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, catchError, map, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
        .post<{ name: string }>(
            'https://progettocorsoangular2-97b9a-default-rtdb.europe-west1.firebasedatabase.app/posts.json', // URL
            postData, // body
            {
                observe: 'response'
            }
        ).subscribe(responseData => {
            console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });
  }

  fetchPost() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    return this.http.get<{ [key: string]: Post }>(
      'https://progettocorsoangular2-97b9a-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      {
        headers: new HttpHeaders({ 'Custom-Header' : 'Hello' }),
        params: searchParams
      }
    )
    .pipe(
        map(responseData => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
                }
            }
            return postsArray;
        }),
        catchError(errorRes => {
            return throwError(errorRes);
        })
    );
  }

  deletePosts() {
    return this.http.delete(
        'https://progettocorsoangular2-97b9a-default-rtdb.europe-west1.firebasedatabase.app/',
        {
            observe: 'events'
        }
    ).pipe(tap(event => {
        console.log(event);
        if(event.type === HttpEventType.Response){
            console.log(event.body);
        }
    })
    );
  }
}
