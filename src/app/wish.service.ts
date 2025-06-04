import { Injectable, signal } from '@angular/core';
import { IWish } from './wish.model';

@Injectable({ providedIn: 'root' })
export class WishService {
    wishes = signal<IWish[]>([]);
}
