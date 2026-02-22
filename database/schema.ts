import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'menu_items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'category', type: 'string' },
        { name: 'image_url', type: 'string' },
        { name: 'available', type: 'boolean' },
        { name: 'rating', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tables',
      columns: [
        { name: 'table_number', type: 'number' },
        { name: 'seats', type: 'number' },
        { name: 'section', type: 'string' },
        { name: 'status', type: 'string' }, // available, occupied, reserved
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'table_id', type: 'string', isIndexed: true },
        { name: 'order_number', type: 'string' },
        { name: 'status', type: 'string' }, // pending, preparing, ready, completed, cancelled
        { name: 'total_amount', type: 'number' },
        { name: 'staff_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'order_items',
      columns: [
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'menu_item_id', type: 'string', isIndexed: true },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
