import { IRestaurants } from './renderRestaurants';
import { ICart } from './cart';

export interface IDish {
  id: string,
  name: string,
  description: string,
  price: number,
  image: string,
  spiciness: string,
  popularity: boolean
}

const cardsMenu = document.querySelector('.cards-menu') as HTMLElement;

export class Menu {
  static addToCart = (cartItem: ICart) => {
    const cartArray: ICart[] = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') || '{}') : [];
    const result = cartArray.reduce((sum: number, current: ICart) => sum + current.count, 0);
    if (result >= 20) {
      alert('Можно заказать не более 20 блюд'); // eslint-disable-line no-alert
      return;
    }
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
    cardsMenu.innerHTML = '';
    const noRest = document.querySelector('.no-poisk__wrapper') as HTMLElement;
    if (data.length === 0) {
      noRest.innerHTML = 'Таких блюд нет';
      return;
    }
    data.forEach((dish: IDish) => {
      const card = document.createElement('div') as HTMLElement;
      card.classList.add('card');
      if (dish.popularity) {
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
                                <div class="card-param">
                                    <div class="pop-img__wrapper">
                                        <img src="assets/img/icon/popular.png" class="popular-img" alt="popular">
                                    </div>
                                    <div class="wrapper-spic">
                                        Острота: ${dish.spiciness}
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
      } else {
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
                                <div class="card-param">
                                    <div class="wrapper-spic">
                                        Острота: ${dish.spiciness}
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
      }

      (card.querySelector('.button-card-text') as HTMLElement).addEventListener('click', () => {
        Menu.addToCart({
          name: dish.name,
          price: dish.price,
          id: dish.id,
          count: 1,
        } as ICart);
      });
      noRest.innerHTML = '';
      cardsMenu.append(card);
    });
  };

  static changeTitle = (restaurant: IRestaurants): void => {
    const restaurantTitle = document.querySelector('.restaurant-title') as HTMLElement;
    restaurantTitle.innerHTML = restaurant.name;
  };
}
