export interface ICart {
  name: string,
  price: number,
  id: string,
  count: number
}

const buttonCart = document.getElementById('cart-button') as HTMLElement; // кнопка корзины
const modalCart = document.querySelector('.modal-cart') as Element; // модалка корзины
const close = modalCart.querySelector('.close') as Element; // закрытие модалки
const body = modalCart.querySelector('.modal-body') as Element; // все товары
const buttonSend = modalCart.querySelector('.button-primary') as Element; // отправить в корзину
const price = modalCart.querySelector('.modal-pricetag') as Element; // цена
const cancel = modalCart.querySelector('.clear-cart') as Element; // отмена

export class Cart {
  static resetCart = (): void => {
    body.innerHTML = '';
    localStorage.removeItem('cart');
    modalCart.classList.remove('is-open');
    price.innerHTML = '0 ₽';
  };

  static changePrice = (): void => {
    let allPrice = 0;
    const cartArray: ICart[] = JSON.parse(localStorage.getItem('cart') || '{}');
    cartArray.forEach((item: ICart) => {
      allPrice += item.price * item.count;
    });
    price.innerHTML = `${allPrice} ₽`;
  };

  static incrementCount = (id: string): void => {
    const cartArray: ICart[] = JSON.parse(localStorage.getItem('cart') || '{}');
    const result = cartArray.reduce((sum: number, current: ICart) => sum + current.count, 0);
    if (result >= 20) {
      alert('Можно заказать не более 20 блюд'); // eslint-disable-line no-alert
      return;
    }
    cartArray.map((item: ICart) => {
      if (item.id === id) {
        item.count += item.count >= 0 ? 1 : 0;
      }
      return item;
    });

    localStorage.setItem('cart', JSON.stringify(cartArray));
    Cart.renderItems(cartArray);
  };

  static decrimentCount = (id: string): void => {
    const cartArray: ICart[] = JSON.parse(localStorage.getItem('cart') || '{}');
    cartArray.map((item) => {
      if (item.id === id) {
        item.count -= item.count > 1 ? 1 : 0;
      }
      return item;
    });

    localStorage.setItem('cart', JSON.stringify(cartArray));
    Cart.renderItems(cartArray);
  };

  static deleteCart = (id: string) => {
    const cartArray: ICart[] = JSON.parse(localStorage.getItem('cart') || '{}');
    const mas = cartArray.filter((item) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(mas));
    Cart.changePrice();
    Cart.renderItems(mas);
  };

  static renderItems = (data: ICart[]): void => {
    body.innerHTML = '';
    data.forEach((item: ICart) => {
      const cartElem = document.createElement('div');
      cartElem.classList.add('food-row');

      cartElem.innerHTML = `<span class="food-name">${item.name}</span>
            <strong class="food-price">${item.price} ₽</strong>
            <div class="food-counter">
                <button class="button delete-cart" data-index="${item.id}">X</button>
                <button class="counter-button btn-dec" data-index="${item.id}">-</button>
                <span class="counter">${item.count}</span>
                <button class="counter-button btn-inc" data-index="${item.id}">+</button>
            </div>`;

      Cart.changePrice();
      body.append(cartElem);
    });
  };

  static cart = (): void => {
    cancel.addEventListener('click', () => {
      localStorage.removeItem('cart');
      window.location.reload();
      modalCart.classList.remove('is-open');
    });

    body.addEventListener('click', (e) => {
      e.preventDefault();
      if ((e.target as HTMLTextAreaElement).classList.contains('btn-dec')) {
        Cart.decrimentCount((e.target as HTMLElement).dataset.index as string);
      } else if ((e.target as HTMLTextAreaElement).classList.contains('btn-inc')) {
        Cart.incrementCount((e.target as HTMLElement).dataset.index as string);
      } else if ((e.target as HTMLTextAreaElement).classList.contains('delete-cart')) {
        Cart.deleteCart((e.target as HTMLElement).dataset.index as string);
      }
    });

    buttonSend.addEventListener('click', () => {
      const cartArray = localStorage.getItem('cart');

      if (price.innerHTML === '0 ₽') {
        alert('Вы ничего не выбрали!'); // eslint-disable-line no-alert
        return;
      }

      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: cartArray,
      })
        .then((response) => {
          if (response.ok) {
            Cart.resetCart();
          }
        })
        .catch((error) => {
          throw error;
        });
    });

    (buttonCart as Element).addEventListener('click', () => {
      if (localStorage.getItem('cart')) {
        Cart.renderItems(JSON.parse(localStorage.getItem('cart') || '{}') as ICart[]);
      }
      modalCart.classList.add('is-open');
    });

    close.addEventListener('click', () => {
      modalCart.classList.remove('is-open');
    });
  };
}
