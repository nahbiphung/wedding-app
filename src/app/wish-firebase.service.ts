import { inject, Injectable } from '@angular/core';

import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, orderBy, query } from 'firebase/firestore';
import { from, Observable } from 'rxjs';

import { IWish } from './wish.model';

@Injectable({ providedIn: 'root' })
export class WishFirebaseService {
    firestore = inject(Firestore);
    wishesCollection = collection(this.firestore, 'wishes');

    getWishes(): Observable<IWish[]> {
        const queryCollection = query(this.wishesCollection, orderBy('createdAt', 'asc'));

        return collectionData(queryCollection, { idField: 'id' }) as Observable<IWish[]>;
    }

    addWish(text: string): Observable<string> {
        const wishCreate = {
            text,
            createdAt: new Date(),
        };
        const promise = addDoc(this.wishesCollection, wishCreate).then((res) => res.id);

        return from(promise);
    }
}
