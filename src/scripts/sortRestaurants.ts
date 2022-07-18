import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { IRestaurants, Restaurants } from './renderRestaurants';
import { IFilterRestaurant, resetFilterRestaurant } from './filterArticles';

export class SortRestaurants {
  static sort = (data: IRestaurants[]): void => {
    const sortUp = document.getElementById('up') as HTMLInputElement;
    const sortDown = document.getElementById('down') as HTMLInputElement;
    const sortLowPrice = document.getElementById('lowPrice') as HTMLInputElement;
    const sortHighPrice = document.getElementById('highPrice') as HTMLInputElement;

    if (sortUp.checked) {
      data.sort((a: IRestaurants, b: IRestaurants) => ((a.name > b.name) ? 1 : -1));
    } else if (sortDown.checked) {
      data.sort((a: IRestaurants, b: IRestaurants) => ((a.name < b.name) ? 1 : -1));
    } else if (sortLowPrice.checked) {
      data.sort((a: IRestaurants, b: IRestaurants) => ((a.price > b.price) ? 1 : -1));
    } else if (sortHighPrice.checked) {
      data.sort((a: IRestaurants, b: IRestaurants) => ((a.price < b.price) ? 1 : -1));
    }
    Restaurants.renderItems(data);
  };

  static filterType = (data: IRestaurants[]): void => {
    const inputPizza = document.getElementById('input-pizza') as HTMLInputElement;
    const inputSushi = document.getElementById('input-sushi') as HTMLInputElement;
    const inputRus = document.getElementById('input-rus') as HTMLInputElement;

    if (!inputPizza.checked && !inputSushi.checked && !inputRus.checked) {
      SortRestaurants.sort(data);
      return;
    }

    const arrFilter = data.filter((item: IRestaurants) => ((inputSushi.checked && item.kitchen.includes('Суши'))
      || (inputPizza.checked && item.kitchen.includes('Пицца'))
      || (inputRus.checked && item.kitchen.includes('Русская кухня'))));
    SortRestaurants.sort(arrFilter);
  };

  static filterPrice = (data: IRestaurants[]): void => {
    const inputLowPrice = document.getElementById('input-low-price') as HTMLInputElement;
    const inputMidPrice = document.getElementById('input-mid-price') as HTMLInputElement;
    const inputHighPrice = document.getElementById('input-high-price') as HTMLInputElement;

    if (!inputLowPrice.checked && !inputMidPrice.checked && !inputHighPrice.checked) {
      SortRestaurants.filterType(data);
      return;
    }
    const arrFilter = data.filter((item: IRestaurants) => ((inputLowPrice.checked && item.price >= 400 && item.price <= 700)
      || (inputMidPrice.checked && item.price >= 700 && item.price <= 1000)
      || (inputHighPrice.checked && item.price >= 1000 && item.price <= 1200)));
    SortRestaurants.filterType(arrFilter);
  };

  static filterStar = (data: IRestaurants[], slider1: noUiSlider.API, slider2: noUiSlider.API): void => {
    const lowMark = document.querySelector('.low-mark') as HTMLSpanElement;
    const highMark = document.querySelector('.high-mark') as HTMLSpanElement;
    const [minMark, maxMark] = slider1.get(true) as number[];
    lowMark.innerHTML = `${minMark.toFixed(1)}`;
    highMark.innerHTML = `${maxMark.toFixed(1)}`;
    const arrFilter1 = data.filter((item:IRestaurants) => (item.stars >= minMark && item.stars <= maxMark));

    const lowTime = document.querySelector('.low-time') as HTMLSpanElement;
    const highTime = document.querySelector('.high-time') as HTMLSpanElement;
    const [minTime, maxTime] = slider2.get(true) as number[];
    lowTime.innerHTML = `${minTime.toFixed(0)}`;
    highTime.innerHTML = `${maxTime.toFixed(0)}`;
    const arrFilter2 = arrFilter1.filter((item:IRestaurants) => (item.time_of_delivery >= minTime && item.time_of_delivery <= maxTime));

    SortRestaurants.filterPrice(arrFilter2);
  };

  static getData = (slider1: noUiSlider.API, slider2: noUiSlider.API): void => {
    fetch('assets/db/partners.json')
      .then((response) => response.json())
      .then((data) => {
        SortRestaurants.filterStar(data as IRestaurants[], slider1, slider2);
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  static setFilter = (slider1: noUiSlider.API, slider2: noUiSlider.API, filter: IFilterRestaurant<boolean, number>): void => {
    slider1.set([filter.minStar, filter.maxStar]);
    slider2.set([filter.minTime, filter.maxTime]);
    (document.getElementById('input-pizza') as HTMLInputElement).checked = filter.pizza;
    (document.getElementById('input-sushi') as HTMLInputElement).checked = filter.sushi;
    (document.getElementById('input-rus') as HTMLInputElement).checked = filter.rus;

    (document.getElementById('up') as HTMLInputElement).checked = filter.upAlfa;
    (document.getElementById('down') as HTMLInputElement).checked = filter.downALfa;
    (document.getElementById('lowPrice') as HTMLInputElement).checked = filter.sortLowPrice;
    (document.getElementById('highPrice') as HTMLInputElement).checked = filter.sortHighPrice;

    (document.getElementById('input-low-price') as HTMLInputElement).checked = filter.minPrice;
    (document.getElementById('input-mid-price') as HTMLInputElement).checked = filter.midPrice;
    (document.getElementById('input-high-price') as HTMLInputElement).checked = filter.maxPrice;
  };

  static start = () => {
    const selectBtn = document.querySelector('.sort-filter__btn') as HTMLElement;
    const modalSelect = document.querySelector('.modal__sort-filter') as HTMLElement;
    const closeBtn = document.querySelector('.close__sort-filter') as HTMLElement;

    const inputPizza = document.getElementById('input-pizza') as HTMLInputElement;
    const inputSushi = document.getElementById('input-sushi') as HTMLInputElement;
    const inputRus = document.getElementById('input-rus') as HTMLInputElement;

    const sortUp = document.getElementById('up') as HTMLInputElement;
    const sortDown = document.getElementById('down') as HTMLInputElement;
    const sortLowPrice = document.getElementById('lowPrice') as HTMLInputElement;
    const sortHighPrice = document.getElementById('highPrice') as HTMLInputElement;

    const inputLowPrice = document.getElementById('input-low-price') as HTMLInputElement;
    const inputMidPrice = document.getElementById('input-mid-price') as HTMLInputElement;
    const inputHighPrice = document.getElementById('input-high-price') as HTMLInputElement;

    const resetFilter = document.querySelector('.reset-filter') as HTMLElement;
    const deleteLocal = document.querySelector('.delete-local') as HTMLElement;

    const sliderMark = document.getElementById('slider1') as HTMLElement;

    const slider1: noUiSlider.API = noUiSlider.create(sliderMark, {
      start: [3, 5],
      connect: true,
      range: {
        min: 3,
        max: 5,
      },
    });

    const sliderTime = document.getElementById('slider2') as HTMLElement;

    const slider2: noUiSlider.API = noUiSlider.create(sliderTime, {
      start: [30, 80],
      connect: true,
      range: {
        min: 30,
        max: 80,
      },
    });

    const allFilter = JSON.parse(localStorage.getItem('filterRestaurant') || '{}') as IFilterRestaurant<boolean, number>;

    if (Object.keys(allFilter).length !== 0) {
      SortRestaurants.setFilter(slider1, slider2, allFilter);
    }
    SortRestaurants.getData(slider1, slider2);

    selectBtn.addEventListener('click', (): void => {
      modalSelect.style.display = 'flex';
    });

    closeBtn.addEventListener('click', (): void => {
      modalSelect.style.display = 'none';
    });

    inputPizza.addEventListener('change', (): void => {
      allFilter.pizza = inputPizza.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    inputSushi.addEventListener('change', (): void => {
      allFilter.sushi = inputSushi.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    inputRus.addEventListener('change', (): void => {
      allFilter.rus = inputRus.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    slider1.on('change', (): void => {
      const [minMark, maxMark] = slider1.get(true) as number[];
      allFilter.minStar = minMark;
      allFilter.maxStar = maxMark;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    slider2.on('change', (): void => {
      const [minTime, maxTime] = slider2.get(true) as number[];
      allFilter.minTime = minTime;
      allFilter.maxTime = maxTime;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    sortUp.addEventListener('change', (): void => {
      allFilter.upAlfa = sortUp.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    sortDown.addEventListener('change', (): void => {
      allFilter.downALfa = sortDown.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    sortLowPrice.addEventListener('change', (): void => {
      allFilter.sortLowPrice = sortLowPrice.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    sortHighPrice.addEventListener('change', (): void => {
      allFilter.sortLowPrice = sortHighPrice.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    inputLowPrice.addEventListener('change', (): void => {
      allFilter.minPrice = inputLowPrice.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    inputMidPrice.addEventListener('change', (): void => {
      allFilter.midPrice = inputMidPrice.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    inputHighPrice.addEventListener('change', (): void => {
      allFilter.maxPrice = inputHighPrice.checked;
      localStorage.setItem('filterRestaurant', JSON.stringify(allFilter));
      SortRestaurants.getData(slider1, slider2);
    });

    resetFilter.addEventListener('click', (): void => {
      resetFilterRestaurant.upAlfa = (document.getElementById('up') as HTMLInputElement).checked;
      resetFilterRestaurant.downALfa = (document.getElementById('down') as HTMLInputElement).checked;
      resetFilterRestaurant.sortLowPrice = (document.getElementById('lowPrice') as HTMLInputElement).checked;
      resetFilterRestaurant.sortHighPrice = (document.getElementById('highPrice') as HTMLInputElement).checked;
      SortRestaurants.setFilter(slider1, slider2, resetFilterRestaurant);
      localStorage.setItem('filterRestaurant', JSON.stringify(resetFilterRestaurant));
      SortRestaurants.getData(slider1, slider2);
    });

    deleteLocal.addEventListener('click', (): void => {
      localStorage.removeItem('cart');
      localStorage.removeItem('filterRestaurant');
      localStorage.removeItem('restaurant');
      localStorage.removeItem('user');
      localStorage.removeItem('filterDish');
      window.location.reload();
    });
  };
}
