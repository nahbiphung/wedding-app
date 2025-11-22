import { DatePipe, NgFor, NgStyle } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { DeviceDetectorService } from 'ngx-device-detector';
import { WishFirebaseService } from '../wish-firebase.service';
import { WishService } from '../wish.service';

@Component({
    selector: 'app-wedding-main',
    imports: [NgStyle, NgFor, FormsModule, DatePipe],
    templateUrl: './wedding-main.component.html',
    styleUrl: './wedding-main.component.css',
})
export class WeddingMainComponent implements OnInit, AfterViewInit, OnDestroy {
    wish: string = '';
    isSpinning = true;

    Math = Math;
    targetDate = '2025-12-13';
    countdown = { hours: 0, minutes: 0, seconds: 0 };

    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
    @ViewChild('wishesContainer') wishesContainer!: ElementRef<HTMLDivElement>;

    private intervalId: any;

    readonly wishService = inject(WishService);
    private readonly deviceDetectorService = inject(DeviceDetectorService);

    // WebP images with true lazy loading - only first image loaded initially
    optimizedBeachImages = [
        {
            id: 1,
            src: '/Wedding-Images-WebP/NTU01290.webp',
            actualSrc: '/Wedding-Images-WebP/NTU01290.webp',
            loaded: true,
            retryCount: 0,
        },
        {
            id: 2,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01032.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 3,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01357.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 4,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01064.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 5,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01263.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 6,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01240.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 7,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01386.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 8,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01477.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 9,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01352.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 10,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01247.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 11,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01203.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 12,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU01190.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 13,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00949.webp',
            loaded: false,
            retryCount: 0,
        },
    ];

    optimizedIndoorImages = [
        {
            id: 14,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00937.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 15,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00926.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 16,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00908.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 17,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00891.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 18,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00888.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 19,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00839.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 20,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00830.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 21,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00826.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 22,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00811.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 23,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00801.webp',
            loaded: false,
            retryCount: 0,
        },
        {
            id: 24,
            src: '',
            actualSrc: '/Wedding-Images-WebP/NTU00790.webp',
            loaded: false,
            retryCount: 0,
        },
    ];

    // Lightbox state
    selectedImage: any = null;
    showLightbox = false;
    private readonly wishFirebaseService = inject(WishFirebaseService);

    // Lazy loading with Intersection Observer
    private intersectionObserver?: IntersectionObserver;
    private placeholderSrc =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZDBkMGQwIi8+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4oCi4oCi4oCiPC90ZXh0Pjwvc3ZnPic7';

    ngOnInit() {
        this.updateCountdown(this.targetDate);
        this.intervalId = setInterval(() => {
            this.updateCountdown(this.targetDate);
        }, 1000);

        this.wishFirebaseService.getWishes().subscribe((wishes) => {
            // console.log('Fetch wishes from firebase:', wishes);
            this.wishService.wishes.set(wishes);

            setTimeout(() => this.scrollToBottom(), 0);
        });

        gsap.registerPlugin(ScrollTrigger);
        this.setupIntersectionObserver();
    }

    ngAfterViewInit() {
        const audio = this.audioPlayer.nativeElement;

        // console.log('Audio element:', audio);
        audio.play().catch(() => {
            // Autoplay might be blocked by browser
            this.isSpinning = false;
        });

        // Setup Intersection Observer for all lazy loaded images after view init
        setTimeout(() => {
            this.observeAllImages();
        }, 100);
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
                audio.play().catch(() => {
                    // Autoplay might be blocked by browser
                });
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

    // True lazy loading with Intersection Observer + Mobile optimizations
    private setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            // Mobile-friendly settings using DeviceDetectorService
            const isMobile = this.deviceDetectorService.isMobile();

            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const imgElement = entry.target as HTMLImageElement;
                            const imageId = parseInt(
                                imgElement.getAttribute('data-image-id') || '0'
                            );
                            this.loadImage(imageId);
                            this.intersectionObserver?.unobserve(imgElement);

                            // On mobile, preload next image for smoother scrolling
                            if (isMobile) {
                                this.preloadNextImage(imageId);
                            }
                        }
                    });
                },
                {
                    root: null,
                    // Larger margin for mobile to account for faster scrolling
                    rootMargin: isMobile ? '200px' : '100px',
                    // Lower threshold for mobile to trigger earlier
                    threshold: isMobile ? 0.05 : 0.1,
                }
            );
        } else {
            // Fallback for browsers without Intersection Observer (old mobile browsers)
            console.warn('IntersectionObserver not supported, using scroll fallback');
            this.setupScrollFallback();
        }
    }

    private observeAllImages() {
        if (this.intersectionObserver) {
            // Find all image elements with data-image-id attribute
            const imageElements = document.querySelectorAll('img[data-image-id]');
            imageElements.forEach((imgElement) => {
                const imageId = parseInt(imgElement.getAttribute('data-image-id') || '0');
                const image = [...this.optimizedBeachImages, ...this.optimizedIndoorImages].find(
                    (img) => img.id === imageId
                );

                // Only observe if image is not loaded yet
                if (image && !image.loaded) {
                    this.intersectionObserver!.observe(imgElement);
                }
            });
        }
    }

    // Mobile optimization: preload next image for smoother scrolling
    private preloadNextImage(currentImageId: number) {
        const allImages = [...this.optimizedBeachImages, ...this.optimizedIndoorImages];
        const currentIndex = allImages.findIndex((img) => img.id === currentImageId);

        if (currentIndex >= 0 && currentIndex < allImages.length - 1) {
            const nextImage = allImages[currentIndex + 1];
            if (nextImage && !nextImage.loaded) {
                // Delay preload to not interfere with current image loading
                setTimeout(() => {
                    this.loadImage(nextImage.id);
                }, 500);
            }
        }
    }

    // Fallback for browsers without Intersection Observer (old mobile browsers)
    private setupScrollFallback() {
        let ticking = false;

        const checkImages = () => {
            const imageElements = document.querySelectorAll('img[data-image-id]');
            imageElements.forEach((imgElement: Element) => {
                const rect = imgElement.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;

                if (isVisible) {
                    const imageId = parseInt(imgElement.getAttribute('data-image-id') || '0');
                    const image = [
                        ...this.optimizedBeachImages,
                        ...this.optimizedIndoorImages,
                    ].find((img) => img.id === imageId);

                    if (image && !image.loaded) {
                        this.loadImage(imageId);
                    }
                }
            });
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkImages();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // Initial check
        setTimeout(checkImages, 100);
    }

    onImageLoad(imgElement: HTMLImageElement) {
        // This method is now used only for tracking when images finish loading
        // The actual lazy loading is handled by Intersection Observer
    }

    private loadImage(imageId: number) {
        const allImages = [...this.optimizedBeachImages, ...this.optimizedIndoorImages];
        const image = allImages.find((img) => img.id === imageId);

        if (image && !image.loaded) {
            console.log(`Loading image ${imageId}: ${image.actualSrc}`);

            // Mobile-specific: Check network connection if available
            const connection = (navigator as any).connection;
            const isSlowConnection =
                connection &&
                (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

            // Create new image object to preload
            const img = new Image();

            // Mobile optimization: Add timeout for slow connections
            let timeoutId: number | undefined;
            if (isSlowConnection) {
                timeoutId = window.setTimeout(() => {
                    console.warn(`Image ${imageId} loading timeout on slow connection`);
                    img.src = ''; // Cancel loading
                }, 10000); // 10 second timeout for slow connections
            }

            img.onload = () => {
                if (timeoutId) clearTimeout(timeoutId);

                // Update the image object with actual src
                image.src = image.actualSrc;
                image.loaded = true;
                console.log(`Image ${imageId} loaded successfully`);
            };

            img.onerror = () => {
                if (timeoutId) clearTimeout(timeoutId);

                console.error('Failed to load image:', image.actualSrc);

                // Mobile-friendly retry logic
                if (!image.retryCount) {
                    image.retryCount = 1;
                    console.log(`Retrying image ${imageId}`);
                    setTimeout(() => {
                        image.loaded = false;
                        this.loadImage(imageId);
                    }, 2000);
                } else {
                    image.loaded = true; // Mark as loaded to prevent infinite retry
                }
            };

            img.src = image.actualSrc;
        }
    }

    getImageSrc(image: any): string {
        return image.src || this.placeholderSrc;
    }

    // Lightbox functionality
    openLightbox(image: any) {
        // Create a new object with full resolution for lightbox
        this.selectedImage = {
            ...image,
            src: image.actualSrc || image.src,
        };
        this.showLightbox = true;

        // Ensure full resolution image is loaded for lightbox
        if (!image.loaded) {
            this.loadImage(image.id);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.showLightbox = false;
        this.selectedImage = null;
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }

    trackByImageId(index: number, image: any): number {
        return image.id;
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
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
