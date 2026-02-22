import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation } from '@nozbe/watermelondb/decorators';
import type MenuItem from './MenuItem';
import type Order from './Order';

export default class OrderItem extends Model {
  static table = 'order_items';
  static associations = {
    orders: { type: 'belongs_to' as const, key: 'order_id' },
    menu_items: { type: 'belongs_to' as const, key: 'menu_item_id' },
  };

  @field('order_id') orderId: string;
  @field('menu_item_id') menuItemId: string;
  @field('quantity') quantity: number;
  @field('price') price: number;
  @field('notes') notes?: string;
  
  @readonly @date('created_at') createdAt: Date;

  @relation('orders', 'order_id') order: Order;
  @relation('menu_items', 'menu_item_id') menuItem: MenuItem;
}
