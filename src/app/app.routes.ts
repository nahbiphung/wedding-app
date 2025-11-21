import { Routes } from '@angular/router';

import { InvitationCardComponent } from './invitation-card/invitation-card.component';
import { WeddingMainComponent } from './wedding-main/wedding-main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageNotSupportedComponent } from './page-not-supported/page-not-supported.component';

export const routes: Routes = [
    { path: 'invitation-card', component: InvitationCardComponent },
    { path: 'page-not-supported', component: PageNotSupportedComponent },
    { path: '', component: WeddingMainComponent, pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];
