import './style.css';
import { Auth } from './scripts/auth';
import { Cart } from './scripts/cart';
import { SearchRestaurant } from './scripts/searchRestaurant';
import { SortRestaurants } from './scripts/sortRestaurants';
import { SortDishes } from './scripts/sortDishes';
import { SearchDish } from './scripts/searchDish';

Auth.auth();
Cart.cart();
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  SearchRestaurant.search();
  SortRestaurants.start();
}
if (window.location.pathname === '/restaurant.html') {
  SortDishes.start();
  SearchDish.search();
}
