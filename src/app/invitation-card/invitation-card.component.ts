import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-invitation-card',
    templateUrl: './invitation-card.component.html',
    styleUrls: ['./invitation-card.component.css'],
})
export class InvitationCardComponent implements AfterViewInit {
    @ViewChild('cardWrapper') cardWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('card') card!: ElementRef<HTMLDivElement>;
    @ViewChild('highlight') highlight!: ElementRef<HTMLDivElement>;
    @ViewChild('dot') dot!: ElementRef<HTMLDivElement>;
    @ViewChild('testSection') testSection!: ElementRef<HTMLDivElement>;
    @ViewChild('positionXY') positionXY!: ElementRef<HTMLDivElement>;
    @ViewChild('permissionButton') permissionButton!: ElementRef<HTMLButtonElement>;

    mostX = 10;
    mostY = -10;

    ngAfterViewInit() {
        // Device Orientation Permission for iOS
        if (typeof (window as any).DeviceOrientationEvent?.requestPermission === 'function') {
            this.permissionButton.nativeElement.addEventListener('click', () => {
                (window as any).DeviceOrientationEvent.requestPermission()
                    .then((response: string) => {
                        if (response === 'granted') {
                            window.addEventListener(
                                'deviceorientation',
                                this.handleOrientation,
                                true
                            );
                        } else {
                            this.testSection.nativeElement.innerHTML = `<p>Permission denied for Device Orientation.</p>`;
                        }
                    })
                    .catch((error: any) => {
                        console.error('Error requesting permission:', error);
                    });
            });
        }

        // Device Orientation for other devices
        if ((window as any).DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.handleOrientation, true);
        } else {
            this.testSection.nativeElement.innerHTML = `<p>Device Orientation API not supported</p>`;
        }

        // Mouse events
        this.cardWrapper.nativeElement.addEventListener('mousemove', this.handleMouseMove);
        this.cardWrapper.nativeElement.addEventListener('mouseleave', this.handleMouseLeave);
    }

    handleOrientation = (event: DeviceOrientationEvent) => {
        const leftToRight = event.gamma ?? 0;
        const frontToBack = event.beta ?? 0;

        this.testSection.nativeElement.innerHTML = `
      <p>Left to Right: ${leftToRight}</p>
      <p>Front to Back: ${frontToBack}</p>
    `;

        const { width, height } = this.cardWrapper.nativeElement.getBoundingClientRect();
        const minGamma = -5,
            maxGamma = 5;
        const leftToRightClamped = Math.max(minGamma, Math.min(maxGamma, leftToRight));
        const offsetX = ((leftToRightClamped - minGamma) / (maxGamma - minGamma)) * width;

        const minBeta = 25,
            maxBeta = 50;
        const frontToBackClamped = Math.max(minBeta, Math.min(maxBeta, frontToBack));
        const offsetY = ((frontToBackClamped - minBeta) / (maxBeta - minBeta)) * height;

        const halfWidth = width / 2,
            halfHeight = height / 2;
        const rotationY = ((offsetX - halfWidth) / halfWidth) * this.mostX;
        const rotationX = ((offsetY - halfHeight) / halfHeight) * this.mostY;

        this.positionXY.nativeElement.innerHTML = `
      <p>offsetX: ${offsetX}</p>
      <p>offsetY: ${offsetY}</p>
      <p>rotationX: ${rotationX}</p>
      <p>rotationY: ${rotationY}</p>
    `;

        this.card.nativeElement.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        this.highlight.nativeElement.style.left = `${(rotationY / this.mostX) * 60 * -1}%`;
        this.highlight.nativeElement.style.top = `${(rotationX / this.mostY) * 60 * -1}%`;
        this.dot.nativeElement.style.left = `${offsetX}px`;
        this.dot.nativeElement.style.top = `${offsetY}px`;
    };

    handleMouseMove = (e: MouseEvent) => {
        this.card.nativeElement.style.transition = 'none';
        this.highlight.nativeElement.style.transition = 'none';

        const x = e.offsetX,
            y = e.offsetY;
        const { width, height } = this.cardWrapper.nativeElement.getBoundingClientRect();
        const halfWidth = width / 2,
            halfHeight = height / 2;

        const rotationY = ((x - halfWidth) / halfWidth) * this.mostX;
        const rotationX = ((y - halfHeight) / halfHeight) * this.mostY;

        this.positionXY.nativeElement.innerHTML = `
      <p>e.offsetX: ${e.offsetX}</p>
      <p>e.offsetY: ${e.offsetY}</p>
      <p>rotationX: ${rotationX}</p>
      <p>rotationY: ${rotationY}</p>
    `;

        this.card.nativeElement.style.transform = `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`;
        this.highlight.nativeElement.style.left = `${(rotationY / this.mostX) * 60 * -1}%`;
        this.highlight.nativeElement.style.top = `${(rotationX / this.mostY) * 60 * -1}%`;
        this.dot.nativeElement.style.left = `${x}px`;
        this.dot.nativeElement.style.top = `${y}px`;
    };

    handleMouseLeave = () => {
        this.card.nativeElement.style.transition = 'transform 0.5s ease-in-out';
        this.card.nativeElement.style.transform = `rotateY(0) rotateX(0)`;
        this.highlight.nativeElement.style.transition =
            'left 0.5s ease-in-out, top 0.5s ease-in-out';
        this.highlight.nativeElement.style.left = `16%`;
        this.highlight.nativeElement.style.top = `10%`;

        const { width, height } = this.cardWrapper.nativeElement.getBoundingClientRect();
        this.dot.nativeElement.style.left = `${width / 2}px`;
        this.dot.nativeElement.style.top = `${height / 2}px`;
    };
}
