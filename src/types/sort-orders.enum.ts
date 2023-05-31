import {SortOrder} from 'mongoose';

export const Orders = {
  asc: 'asc' as SortOrder,
  dest: 'dest' as SortOrder
} as const;
