import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as FileSaver from 'file-saver/FileSaver';

@Component({
  selector: 'app-root',
  template:  `
    <header>
      <h3>Language Patterns</h3>
    </header>
    <div class="body-container">
      <div class="controls">
        <input placeholder="Search term" [(ngModel)]="searchTerm">
        <input placeholder="lat,long" [(ngModel)]="coordinates">
        <input placeholder="Radius in miles" [(ngModel)]="radius">
        <label>
          Results Type
          <select [(ngModel)]="searchType">
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
        <button (click)="search()">
          Search
        </button>
      </div>
      <div>
        <label>
          Data type
          <select [(ngModel)]="exportType">
            <option value="json">json</option>
            <option value="csv">excel/csv</option>
          </select>
        </label>
        <button (click)="exportContent()">
          Export
        </button>
      </div>
      <ng-container *ngIf="loading">
        <h3>Loading...</h3>
      </ng-container>
      <ng-container *ngIf="!loading">
      <div class="results">
        Results: {{ tweets.length }}
      </div>
      <div *ngFor="let tweet of tweets" class="tweet">
        <div>
          <label>Created</label>: {{ tweet.created_at }}
        </div>
        <div>
          <label>Location</label>: <strong>{{ tweet.user.location }}</strong> {{ tweet.text }}
        </div>
      </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tweets = []
  coordinates = ''
  radius = ''
  searchTerm = ''
  searchType = 'recent'
  loading = false
  exportType = 'json'

  constructor(
    private http: HttpClient
  ) {}

  search() {
    if (this.loading) {
      return;
    }

    this.loading = true

    if (!this.searchTerm || !this.coordinates || !this.radius || !this.searchType) {
      alert(`Looks like you're missing a search parameter, try again :p`);
      return;
    }

    this.http
      .get(
        `https://language-patterns-hkqdawbpzv.now.sh?` +
        `q=${this.searchTerm}&` +
        `geocode=${this.coordinates},${this.radius}mi&` +
        `search_type=${this.searchType}`
      )
      .subscribe(res => {
        this.loading = false
        this.tweets = res['statuses'].filter(tweet => tweet.text.slice(0, 2) !== 'RT');
      });
  }

  exportContent() {
    if (!this.tweets.length) {
      return;
    }
    function download(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }

    if (this.exportType === 'json') {
      this.toJson();
    } else {
      const csvContent = this.tweets.map(tweet => `${tweet.text}`);

      // download(JSON.stringify(csvContent), 'tweets.csv', 'text/csv');

      FileSaver.saveAs(
        new Blob([csvContent], { type: 'text/csv;charset=utf-8' }),
        'tweets.csv',
        true
      );
    }
  }

  toJson() {
    const jsonContent = {};

    this.tweets.forEach((tweet, i) => {
      jsonContent[i] = tweet.text;
    })

    function download(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    download(JSON.stringify(jsonContent), 'tweets.json', 'text/plain');
  }
}
