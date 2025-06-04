import { Timestamp } from 'firebase/firestore';

export interface IWish {
    id?: string;
    text: string;
    createdAt?: Timestamp;
}
