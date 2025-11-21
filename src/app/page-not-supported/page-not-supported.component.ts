import { Component } from '@angular/core';

@Component({
    selector: 'app-page-not-supported',
    imports: [],
    templateUrl: './page-not-supported.component.html',
    styleUrl: './page-not-supported.component.css',
})
export class PageNotSupportedComponent {
    // QR Code configuration
    qrCodeUrl = 'https://oai-test-3d517.web.app/';
    qrCodeSize = '96x96';

    // Generate QR code image URL
    get qrCodeImageUrl(): string {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${this.qrCodeSize}&data=${encodeURIComponent(this.qrCodeUrl)}&bgcolor=ffffff&color=333333`;
    }
}
