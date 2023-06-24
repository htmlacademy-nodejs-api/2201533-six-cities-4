import store from '../store';

import type {Offer, Comment, City, SortName, User, OfferItem} from './types';
import { AuthorizationStatus, SubmitStatus } from '../const';


export type SiteData = {
    offers: OfferItem[];
    isOffersLoading: boolean;
    offer: Offer | null;
    isOfferLoading: boolean;
    favoriteOffers: OfferItem[];
    isFavoriteOffersLoading: boolean;
    premiumOffers: OfferItem[];
    comments: Comment[];
    commentStatus: SubmitStatus;
};

export type SiteProcess = {
    city: City;
    sorting: SortName;
}

export type UserProcess = {
    authorizationStatus: AuthorizationStatus;
    user: User['email'];
}

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
