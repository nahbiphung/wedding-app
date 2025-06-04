import { CommonModule, DatePipe, NgFor, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NumberPadPipe } from './shared/pipes/number-pad.pipe';
import { FormsModule } from '@angular/forms';
import { WishService } from './wish.service';
import { WishFirebaseService } from './wish-firebase.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [NgStyle, NumberPadPipe, NgFor, FormsModule, DatePipe],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'wedding-app';

    wish: string = '';
    isSpinning = true;

    Math = Math;
    targetDate = '2025-12-13';
    countdown = { hours: 0, minutes: 0, seconds: 0 };

    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
    @ViewChild('wishesContainer') wishesContainer!: ElementRef<HTMLDivElement>;

    private intervalId: any;

    readonly wishService = inject(WishService);
    private readonly wishFirebaseService = inject(WishFirebaseService);

    ngOnInit() {
        this.updateCountdown(this.targetDate);
        this.intervalId = setInterval(() => {
            this.updateCountdown(this.targetDate);
        }, 1000);

        this.wishFirebaseService.getWishes().subscribe((wishes) => {
            console.log('Fetch wishes from firebase:', wishes);
            this.wishService.wishes.set(wishes);
        });
    }

    ngAfterViewInit() {
        this.audioPlayer?.nativeElement.play().catch(() => {
            // Autoplay might be blocked by browser
        });
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    flowers = Array.from({ length: 10 }).map((_, i) => ({
        left: i * 10 + Math.random() * 5,
        duration: 5 + Math.random() * 3,
        delay: Math.random() * 5,
    }));

    toggleAudio() {
        const audio = this.audioPlayer?.nativeElement;
        if (audio) {
            if (audio.paused) {
                audio.play().catch(() => {});
            } else {
                audio.pause();
            }
        }
    }

    getDaysLeft(): number {
        const today = new Date();
        const targetDate = new Date(this.targetDate);
        const timeDifference = targetDate.getTime() - today.getTime();
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }

    openMap = () => {
        window.open(
            'https://www.google.com/maps/place/Nh%C3%A0+H%C3%A0ng+%C3%81i+Hu%C3%AA+2+-+%E6%84%9B%E8%8F%AF+2+%E5%A4%A7%E6%B4%92%E6%A8%93/@10.7521892,106.6594234,17z/data=!4m16!1m9!3m8!1s0x31752f0c4d558edb:0x2c60d7b2f3e598a0!2zTmjDoCBIw6BuZyDDgWkgSHXDqiAyIC0g5oSb6I-vIDIg5aSn5rSS5qiT!8m2!3d10.7521892!4d106.6620037!9m1!1b1!16s%2Fg%2F11fjvvg90j!3m5!1s0x31752f0c4d558edb:0x2c60d7b2f3e598a0!8m2!3d10.7521892!4d106.6620037!16s%2Fg%2F11fjvvg90j?entry=ttu&g_ep=EgoyMDI1MDUyOC4wIKXMDSoASAFQAw%3D%3D',
            '_blank'
        );
    };

    sendWish() {
        if (!this.wish.trim()) {
            this.wish = '';
            return;
        }

        this.wishFirebaseService.addWish(this.wish).subscribe((id) => {
            console.log('new wish created with id:', id);

            this.wish = '';
            this.scrollToBottom();
        });
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private updateCountdown(target: string) {
        const now = new Date();
        const targetDate = new Date(target);
        const diff = targetDate.getTime() - now.getTime();

        if (diff > 0) {
            const totalSeconds = Math.floor(diff / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            this.countdown = { hours, minutes, seconds };
        } else {
            this.countdown = { hours: 0, minutes: 0, seconds: 0 };
        }
    }

    private scrollToBottom() {
        try {
            const el = this.wishesContainer?.nativeElement;
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        } catch (err) {}
    }
}
