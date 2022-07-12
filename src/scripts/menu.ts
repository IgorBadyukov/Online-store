import { IRestaurants } from './renderRestaurants';
import  { ICart } from './cart';

interface IDish {
  id: string,
  name: string,
  description: string,
  price: number,
  image: string
}

const cardsMenu = document.querySelector('.cards-menu') as HTMLElement;

export class Menu {
  static addToCart = (cartItem: ICart) => {
    const cartArray: ICart[] = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart') || '{}') : [];
    if (cartArray.some((item: ICart) => item.id === cartItem.id)) {
      cartArray.map((item: ICart) => {
        if (item.id === cartItem.id) {
          item.count++;
        }
        return item;
      });
    } else {
      cartArray.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cartArray));
  };

  static renderItems = (data: IDish[]): void => {
    console.log(data)
    data.forEach((dish: IDish) => {
      const card = document.createElement('div') as HTMLElement;
      card.classList.add('card');

      card.innerHTML = `
            <img src=${dish.image} alt=${dish.name} class="card-image" />
                            <div class="card-text">
                                <div class="card-heading">
                                    <h3 class="card-title card-title-reg">${dish.name}</h3>
                                </div>
                                <!-- /.card-heading -->
                                <div class="card-info">
                                    <div class="ingredients">
                                    ${dish.description}
                                    </div>
                                </div>
                                <!-- /.card-info -->
                                <div class="card-buttons">
                                    <button class="button button-primary button-add-cart">
                                        <span class="button-card-text">В корзину</span>
                                        <span class="button-cart-svg"></span>
                                    </button>
                                    <strong class="card-price-bold">${dish.price} ₽</strong>
                                </div>`;
      (card.querySelector('.button-card-text') as HTMLElement).addEventListener('click',() => {
        Menu.addToCart({name: dish.name, price: dish.price, id: dish.id , count: 1 } as ICart);
      });
      console.log(card)
      cardsMenu.append(card);
    });
  };

  static changeTitle = (restaurant: IRestaurants): void => {
    const restaurantTitle = document.querySelector('.restaurant-title') as HTMLElement;
    restaurantTitle.innerHTML = restaurant.name;
  };

  static menu = (): void => {
    if (localStorage.getItem('restaurant')) {
      const restaurant: IRestaurants = JSON.parse(localStorage.getItem('restaurant') || '{}');
      Menu.changeTitle(restaurant);
      fetch(`assets/db/${restaurant.products}`)
        .then((response: Response) => response.json())
        .then((data: IDish[]) => {
          Menu.renderItems(data);
        })
        .catch((error) => {
          throw error;
        });
    } else { window.location.href='/'; }
  }
}
