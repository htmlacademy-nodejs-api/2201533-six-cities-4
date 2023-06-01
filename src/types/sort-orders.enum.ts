import {SortOrder} from 'mongoose';

export const Orders = {
  asc: 'asc' as SortOrder,
  dest: 'desc' as SortOrder
} as const;
