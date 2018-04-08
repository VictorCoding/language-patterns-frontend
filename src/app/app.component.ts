import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  template:  `
    <header>
      <h3>Language Patterns</h3>
    </header>
    <div class="body-container">
      <input placeholder="Search tweets">
      <div *ngFor="let tweet of tweets">
        location: <strong>{{ tweet.user.location }}</strong> {{ tweet.text }}
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tweets = []
  constructor(
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.http
      .get('https://language-patterns-omcjimutwm.now.sh')
      .subscribe(res => {
        this.tweets = res['statuses'];
      });
  }
}
