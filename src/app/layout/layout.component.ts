import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from '../../environments/environment';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    moduleTitle = 'Master';
    public name_module = globals.selectedMenu;
    public isdashboard = localStorage.getItem('isdashboard');
    // public denoSociete = globals.societe;
    public denoSociete = globals.societe;
    editEnable = false;
    constructor(private router: Router) {
        router.events.subscribe((val) => {
            // see also
            this.isdashboard = localStorage.getItem('isdashboard');
            this.name_module = globals.selectedMenu;
        });
    }

    ngOnInit() {
    }

    closeModule() {
        localStorage.setItem('isdashboard', 'true');
        this.router.navigate(['/dashboard']);
      }
}
