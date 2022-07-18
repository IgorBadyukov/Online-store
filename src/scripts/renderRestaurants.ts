export interface IRestaurants {
  image: string,
  kitchen: string,
  name: string
  price: number,
  products: string,
  stars: number,
  time_of_delivery: number
}

export class Restaurants {
  static renderItems = (data: IRestaurants[]): void => {
    const cardsRestaurants = document.querySelector('.cards-restaurants') as HTMLElement;
    const noRest = document.querySelector('.no-poisk__wrapper') as HTMLElement;
    cardsRestaurants.innerHTML = '';
    if (data.length === 0) {
      noRest.innerHTML = 'таких блюд нет';
      return;
    }
    const modalAuth = document.querySelector('.modal-auth') as HTMLElement;
    const userName = document.querySelector('.user-name') as HTMLElement;

    data.forEach((item: IRestaurants) => {
      const a = document.createElement('a') as HTMLElement;
      a.setAttribute('href', '/restaurant.html');
      a.classList.add('card');
      a.classList.add('card-restaurant');

      a.dataset.products = item.products;

      a.innerHTML = `<img src=${item.image} alt=${item.image} class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${item.name}</h3>
                    <span class="card-tag tag">${item.time_of_delivery} мин</span>
                </div>
                <!-- /.card-heading -->
                <div class="card-info">
                    <div class="rating">
                       ${item.stars}
                    </div>
                    <div class="price">От ${item.price} ₽</div>
                    <div class="category">${item.kitchen}</div>
                </div>
                <!-- /.card-info -->
            </div>
            <!-- /.card-text -->`;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (userName.innerHTML === '') {
          modalAuth.style.display = 'flex';
        } else {
          localStorage.setItem('restaurant', JSON.stringify(item));
          window.location.href = '/restaurant.html';
        }
      });

      noRest.innerHTML = '';

      cardsRestaurants.append(a);
    });
  };
}
