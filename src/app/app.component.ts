import {Component, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {buffer, debounceTime, filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  date: Date = new Date(0, 0, 0, 0, 0, 0);
  start: Date = new Date(0, 0, 0, 0, 1, 0);
  time: Date;
  streamInterval = 0;
  sub: Subscription;
  subscription = false;
  started = false;
  completed = false;
  isReset = true;

  timer$: Observable<Date> = new Observable<Date>(obs => {
    obs.next(this.start);
    this.streamInterval = setInterval(() => {
      this.time = new Date(this.start.setSeconds(this.start.getSeconds() - 1));
      obs.next(this.time);

    }, 1000);
  });

  //"Start/Stop" button
  toggle() {
    this.isReset = false;
    this.subscription = !this.subscription;
    if (this.subscription) {
      this.sub = this.timer$.subscribe(date => {
        this.date = date;
        this.started = true;
        if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
          this.sub.unsubscribe();
          clearInterval(this.streamInterval);
          this.completed = true;
        }
      });
    } else {
      this.started = false;
      this.start = new Date(this.date);
      this.sub.unsubscribe();
      clearInterval(this.streamInterval);
    }
  }

  //"Wait" button
  ngOnInit() {
    const dblClickSpeed$ = fromEvent(document.getElementById('waitBtn'), 'click')
      .pipe(debounceTime(300));
    const dblClick$ = fromEvent(document.getElementById('waitBtn'), 'click')
      .pipe(
        buffer(dblClickSpeed$),
        // if need certain number of clicks
        filter(clickArr => clickArr.length === 2),
        // of if more then single click is required
        // filter(clickArr => clickArr.length > 1),
      );
    dblClick$.subscribe(() => {
      this.subscription = false;
      this.started = false;
      this.sub.unsubscribe();
      clearInterval(this.streamInterval);
    });
  }

  //"Reset" button
  reset() {
    this.completed = false;
    this.isReset = true;
    if (this.subscription) {
      this.date = new Date(0, 0, 0, 0, 0, 0,);
      this.start = new Date(0, 0, 0, 0, 1, 0);
      this.sub.unsubscribe();
      clearInterval(this.streamInterval);
      this.subscription = false;
      this.started = false;
      this.subscription = false;
    } else {
      this.start = new Date(0, 0, 0, 0, 1, 0);
      this.date = new Date();
      this.date.setHours(0, 0, 0);
    }
  }

}
