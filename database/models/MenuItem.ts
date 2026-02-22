import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class MenuItem extends Model {
  static table = 'menu_items';

  @field('name') name: string;
  @field('description') description: string;
  @field('price') price: number;
  @field('category') category: string;
  @field('image_url') imageUrl: string;
  @field('available') available: boolean;
  @field('rating') rating?: number;
  
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
}
