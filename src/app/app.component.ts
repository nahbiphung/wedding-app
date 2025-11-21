import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { DeviceDetectorService } from 'ngx-device-detector';

import { environment } from './environments/environment';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'routing-app';

    constructor(
        private readonly deviceDetectorService: DeviceDetectorService,
        private router: Router
    ) {
        console.log('isMobile:', this.deviceDetectorService.isMobile());
        console.log('isDesktop:', this.deviceDetectorService.isDesktop());
        console.log('isTablet:', this.deviceDetectorService.isTablet());

        if (environment.enableDetectFeature && this.deviceDetectorService.isDesktop()) {
            this.router.navigate(['page-not-supported']);
        }
    }
}
