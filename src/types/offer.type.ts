type Location = {
  latitude: number;
  longitude: number;
}

type City = {
  name: string;
  location: Location;
}

type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: number;
  commentsCount: number;
  location: Location;
}
