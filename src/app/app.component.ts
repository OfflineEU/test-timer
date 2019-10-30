import {Component} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  date: Date = new Date(0, 0, 0, 0, 0, 0);
  start: Date = new Date(0, 0, 0, 0, 1, 0); //started timer value
  time: Date;
  streamInterval = 0;
  sub: Subscription;
  clickCounter = 0;
  singleClickTimeout = 0;
  subscription = false;
  started = false;
  completed = false;

  timer$: Observable<Date> = new Observable<Date>(obs => {
    this.streamInterval = setInterval(() => {
      this.time = new Date(this.start.setSeconds(this.start.getSeconds() - 1));
      obs.next(this.time);
    }, 1000);
  });

  //"Start/Stop" button
  toggle() {
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
  wait() {
    this.clickCounter++;
    if (this.clickCounter >= 2) {
      this.clickCounter = 0;
      clearTimeout(this.singleClickTimeout);
      this.waitStop();
    } else if (this.clickCounter === 1) {
      let singleClick = () => {
        this.clickCounter = 0;
      };
      this.singleClickTimeout = setTimeout(singleClick, 300);
    }
  }

  waitStop() {
    this.subscription = false;
    this.started = false;
    this.start = new Date(this.date);
    this.sub.unsubscribe();
    clearInterval(this.streamInterval);
  }

  //"Reset" button
  reset() {
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
