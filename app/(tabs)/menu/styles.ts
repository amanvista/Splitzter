import { Colors } from '@/constants/theme';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Updated Logic: 2 columns for mobile, 4 for tablet
const numColumns = isTablet ? 4 : 2; 
const cardMargin = 6; // Gap between cards
const containerPadding = 16;
const cardWidth = (width - (containerPadding * 2 + (numColumns - 1) * cardMargin * 2)) / numColumns;

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F7F9' 
  },
  
  // --- HEADER ---
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 34,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#fff', 
    letterSpacing: -0.5 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.7)', 
    fontWeight: '500' 
  },
  historyBtn: { 
    padding: 10, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 12 
  },

  // --- SEARCH ---
  searchContainer: { 
    marginTop: 5 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    color: '#1a1a1a', 
    fontSize: 15 
  },

  // --- CATEGORIES ---
  categoryContainer: { 
    paddingVertical: 14 
  },
  categoryScroll: { 
    paddingHorizontal: 16 
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  categoryPillActive: { 
    backgroundColor: '#1a1a1a', 
    borderColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  categoryText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#777' 
  },
  categoryTextActive: { 
    color: '#fff' 
  },

  // --- MENU GRID (2 Columns Mobile) ---
  menuListContainer: { 
    paddingHorizontal: containerPadding, 
    paddingBottom: 130,
    paddingTop: 8,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12,
  },
  
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSelected: { 
    borderColor: Colors.light.primary,
    backgroundColor: '#F9FCFF' 
  },
  cardDisabled: { 
    opacity: 0.5 
  },
  
  imageBox: { 
    height: 100, // Slightly taller for 2-column view
    backgroundColor: '#F8FAFB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emojiText: { 
    fontSize: 44 
  },
  soldOutOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  soldOutText: { 
    color: '#FF3B30', 
    fontWeight: '900', 
    fontSize: 10,
    letterSpacing: 0.8
  },

  // --- CARD CONTENT ---
  cardInfo: { 
    padding: 12 
  },
  itemName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1a1a1a',
    marginBottom: 2
  },
  itemDesc: { 
    fontSize: 11, 
    color: '#999', 
    marginBottom: 8
  },
  
  cardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 4 
  },
  itemPrice: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#1a1a1a' 
  },
  
  // --- ACTION AREA ---
  actionArea: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  addButton: { 
    width: 34, 
    height: 34, 
    borderRadius: 10, 
    backgroundColor: '#F2F5F8', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qtyContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.light.primary, 
    borderRadius: 10, 
    padding: 3 
  },
  qtyBtn: { 
    padding: 4 
  },
  qtyText: { 
    color: '#fff', 
    fontWeight: '900', 
    marginHorizontal: 6, 
    fontSize: 14 
  },

  // --- EMPTY STATE ---
  emptyState: { 
    alignItems: 'center', 
    marginTop: 80 
  },
  emptyText: { 
    marginTop: 12, 
    color: '#A1A1A1', 
    fontSize: 16,
    fontWeight: '500' 
  },

  // --- FLOATING CART ---
  cartSummaryContainer: { 
    position: 'absolute', 
    bottom: 25, 
    left: 16, 
    right: 16 
  },
  cartSummary: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: Colors.light.primary,
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  cartBadgeText: { 
    color: '#fff', 
    fontSize: 13, 
    fontWeight: '900' 
  },
  cartCount: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  cartAmount: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800' 
  },
  checkoutBtn: { 
    backgroundColor: Colors.light.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  viewOrder: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 14,
    marginRight: 4 
  },
});