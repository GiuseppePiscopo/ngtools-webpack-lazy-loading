import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Lazy Loaded Routes Example</h2>
      <ul>
        <li><a routerLink="/default" routerLinkActive="active">Default Route</a></li>
        <li><a routerLink="/lazy" routerLinkActive="active">Load Lazy Route</a></li>
      </ul>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}