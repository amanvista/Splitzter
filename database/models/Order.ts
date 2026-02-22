import { Model, Q } from '@nozbe/watermelondb';
import { children, date, field, readonly, relation } from '@nozbe/watermelondb/decorators';
import type OrderItem from './OrderItem';
import type Table from './Table';

export default class Order extends Model {
  static table = 'orders';
  static associations = {
    tables: { type: 'belongs_to' as const, key: 'table_id' },
    order_items: { type: 'has_many' as const, foreignKey: 'order_id' },
  };

  @field('table_id') tableId: string;
  @field('order_number') orderNumber: string;
  @field('status') status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  @field('total_amount') totalAmount: number;
  @field('staff_name') staffName: string;
  
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @relation('tables', 'table_id') table: Table;
  @children('order_items') orderItems: Q.Query<OrderItem>;
}
