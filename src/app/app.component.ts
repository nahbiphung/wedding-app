import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'wedding-app';

    getDaysLeft(dateString: string): number {
        const today = new Date();
        const targetDate = new Date(dateString);
        const timeDifference = targetDate.getTime() - today.getTime();
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }
}
