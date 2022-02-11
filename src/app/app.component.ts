import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  userActivity;
  userInactive: Subject<any> = new Subject();
  ipAddress: string;
  constructor(public router: Router, private translate: TranslateService) {
    translate.setDefaultLang('en');
    this.setTimeout();
    this.userInactive.subscribe();
    localStorage.removeItem('isLoggedin');
    // localStorage.removeItem('login');
    localStorage.removeItem('mdp');
    this.router.navigate(['/login']);
  }
  setTimeout() {
    this.userActivity = setTimeout(
      () => this.userInactive.next(undefined),
      6000000000000
    );
  }
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  ngOnInit() {}
}
