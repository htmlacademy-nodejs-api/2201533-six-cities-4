import {Orders} from '../types/sort-orders.enum.js';

export const LIMIT_COMMENT = 50;
export const SORT_DEFAULT = {
  date: Orders.dest
};

export const JWT_ALGORITHM = 'HS256';
export const DEFAULT_AVATAR_FILE_NAME = 'avatar.svg';

export const mimeTypes = [
  'image/jpeg',
  'image/png'
];

export const IMAGES_COUNT = 6;

export const offerImageFields = {
  previewImage: 1,
  images: IMAGES_COUNT
};

export const userImageFields = {
  avatar: 1
};
