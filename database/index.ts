import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { Platform } from 'react-native';

import MenuItem from './models/MenuItem';
import Order from './models/Order';
import OrderItem from './models/OrderItem';
import Table from './models/Table';
import { schema } from './schema';

function createAdapter() {
  if (Platform.OS === 'web') {
    return new LokiJSAdapter({
      schema,
      useWebWorker: false,
      useIncrementalIndexedDB: true,
      dbName: 'blinkfeast_pos',
    });
  } else {
    // Dynamically require SQLite adapter only on native
    const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
    return new SQLiteAdapter({
      schema,
      dbName: 'blinkfeast_pos',
    });
  }
}

export const database = new Database({
  adapter: createAdapter(),
  modelClasses: [MenuItem, Table, Order, OrderItem],
});

// Seed initial data
export async function seedDatabase() {
  try {
    const menuItemsCount = await database.get<MenuItem>('menu_items').query().fetchCount();
    
    if (menuItemsCount === 0) {
      await database.write(async () => {
        // Seed menu items
        const menuItems = [
          {
            name: 'Paneer Tikka',
            description: 'Grilled cottage cheese marinated in aromatic spices',
            price: 280,
            category: 'starters',
            imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop',
            available: true,
            rating: 4.5,
          },
          {
            name: 'Veg Spring Roll',
            description: 'Crispy fried rolls filled with fresh vegetables',
            price: 180,
            category: 'starters',
            imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
            available: true,
            rating: 4.2,
          },
          {
            name: 'Butter Chicken',
            description: 'Tender chicken in rich creamy tomato gravy',
            price: 350,
            category: 'main',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop',
            available: true,
            rating: 4.8,
          },
          {
            name: 'Dal Makhani',
            description: 'Slow cooked black lentils in creamy gravy',
            price: 250,
            category: 'main',
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop',
            available: true,
            rating: 4.6,
          },
          {
            name: 'Gulab Jamun',
            description: 'Deep fried milk balls in sweet syrup',
            price: 120,
            category: 'desserts',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop',
            available: true,
            rating: 4.4,
          },
          {
            name: 'Ice Cream',
            description: 'Vanilla bean ice cream',
            price: 150,
            category: 'desserts',
            imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
            available: false,
            rating: 4.3,
          },
          {
            name: 'Masala Chai',
            description: 'Spiced Indian tea',
            price: 40,
            category: 'beverages',
            imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop',
            available: true,
            rating: 4.5,
          },
          {
            name: 'Cold Coffee',
            description: 'Frothy chilled coffee',
            price: 120,
            category: 'beverages',
            imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop',
            available: true,
            rating: 4.3,
          },
        ];

        for (const item of menuItems) {
          await database.get<MenuItem>('menu_items').create((menuItem) => {
            menuItem.name = item.name;
            menuItem.description = item.description;
            menuItem.price = item.price;
            menuItem.category = item.category;
            menuItem.imageUrl = item.imageUrl;
            menuItem.available = item.available;
            menuItem.rating = item.rating;
          });
        }

        // Seed tables
        const tables = [
          { tableNumber: 1, seats: 4, section: 'ground', status: 'available' as const },
          { tableNumber: 2, seats: 2, section: 'ground', status: 'occupied' as const },
          { tableNumber: 3, seats: 6, section: 'ground', status: 'available' as const },
          { tableNumber: 4, seats: 4, section: 'ground', status: 'occupied' as const },
          { tableNumber: 5, seats: 8, section: 'first', status: 'reserved' as const },
          { tableNumber: 6, seats: 2, section: 'first', status: 'available' as const },
          { tableNumber: 7, seats: 4, section: 'first', status: 'occupied' as const },
          { tableNumber: 8, seats: 4, section: 'first', status: 'available' as const },
          { tableNumber: 9, seats: 6, section: 'outdoor', status: 'available' as const },
          { tableNumber: 10, seats: 4, section: 'outdoor', status: 'occupied' as const },
          { tableNumber: 11, seats: 10, section: 'vip', status: 'reserved' as const },
          { tableNumber: 12, seats: 6, section: 'vip', status: 'available' as const },
          { tableNumber: 13, seats: 2, section: 'bar', status: 'occupied' as const },
          { tableNumber: 14, seats: 2, section: 'bar', status: 'available' as const },
        ];

        for (const table of tables) {
          await database.get<Table>('tables').create((t) => {
            t.tableNumber = table.tableNumber;
            t.seats = table.seats;
            t.section = table.section;
            t.status = table.status;
          });
        }

        console.log('Database seeded successfully!');
      });
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
