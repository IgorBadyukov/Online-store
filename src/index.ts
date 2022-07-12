import './style.css';
import { Restaurants } from './scripts/renderRestaurants';
import { Auth } from './scripts/auth';
import { Menu } from "./scripts/menu";

Restaurants.getRestaurants();
Auth.auth();
Menu.menu();
