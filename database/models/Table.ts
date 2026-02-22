import { Model, Q } from '@nozbe/watermelondb';
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators';
import type Order from './Order';

export default class Table extends Model {
  static table = 'tables';
  static associations = {
    orders: { type: 'has_many' as const, foreignKey: 'table_id' },
  };

  @field('table_number') tableNumber: number;
  @field('seats') seats: number;
  @field('section') section: string;
  @field('status') status: 'available' | 'occupied' | 'reserved';
  
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @children('orders') orders: Q.Query<Order>;
}
