import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { Menu, IDish } from './menu';
import { IRestaurants } from './renderRestaurants';
import { IFilterDish, resetFilterDish } from './filterArticles';

export class SortDishes {
  static sort = (data: IDish[]): void => {
    const sortUp = document.getElementById('up') as HTMLInputElement;
    const sortDown = document.getElementById('down') as HTMLInputElement;
    const sortLowPrice = document.getElementById('lowPrice') as HTMLInputElement;
    const sortHighPrice = document.getElementById('highPrice') as HTMLInputElement;

    if (sortUp.checked) {
      data.sort((a: IDish, b: IDish) => ((a.name > b.name) ? 1 : -1));
    } else if (sortDown.checked) {
      data.sort((a: IDish, b: IDish) => ((a.name < b.name) ? 1 : -1));
    } else if (sortLowPrice.checked) {
      data.sort((a: IDish, b: IDish) => ((a.price > b.price) ? 1 : -1));
    } else if (sortHighPrice.checked) {
      data.sort((a: IDish, b: IDish) => ((a.price < b.price) ? 1 : -1));
    }
    Menu.renderItems(data);
  };

  static filterPopularity = (data: IDish[]): void => {
    const inputPop = document.getElementById('input-pop') as HTMLInputElement;
    const arrFilter = (inputPop.checked ? data.filter((item: IDish):boolean => item.popularity) : data) as IDish[];
    SortDishes.sort(arrFilter);
  };

  static filterSpiciness = (data: IDish[]) => {
    const inputNoSpic = document.getElementById('input-nspic') as HTMLInputElement;
    const inputMidSpic = document.getElementById('input-mid') as HTMLInputElement;
    const inputHighSpic = document.getElementById('input-spic') as HTMLInputElement;

    if (!inputNoSpic.checked && !inputMidSpic.checked && !inputHighSpic.checked) {
      SortDishes.filterPopularity(data);
      return;
    }

    const arrFilter = data.filter((item: IDish) => ((inputNoSpic.checked && item.spiciness.includes('Не острое'))
      || (inputMidSpic.checked && item.spiciness.includes('Среднее'))
      || (inputHighSpic.checked && item.spiciness.includes('Острое'))));
    SortDishes.filterPopularity(arrFilter);
  };

  static filterPrice = (data: IDish[], slider: noUiSlider.API): void => {
    const lowPrice = document.querySelector('.low-price') as HTMLSpanElement;
    const highPrice = document.querySelector('.high-price') as HTMLSpanElement;
    const [minValue, maxValue] = slider.get(true) as number[];
    lowPrice.innerHTML = `${minValue.toFixed(0)}`;
    highPrice.innerHTML = `${maxValue.toFixed(0)}`;
    const arrFilter = data.filter((item:IDish) => (item.price >= minValue && item.price <= maxValue));
    SortDishes.filterSpiciness(arrFilter);
  };

  static getData = (slider: noUiSlider.API): void => {
    if (localStorage.getItem('restaurant')) {
      const restaurant: IRestaurants = JSON.parse(localStorage.getItem('restaurant') || '{}');
      Menu.changeTitle(restaurant);
      fetch(`assets/db/${restaurant.products}`)
        .then((response: Response) => response.json())
        .then((data: IDish[]) => {
          SortDishes.filterPrice(data, slider);
        })
        .catch((error) => {
          throw error;
        });
    } else { window.location.href = '/'; }
  };

  static setFilter = (slider: noUiSlider.API, filter: IFilterDish<boolean, number>): void => {
    slider.set([filter.minPrice, filter.maxPrice]);
    (document.getElementById('input-nspic') as HTMLInputElement).checked = filter.lowSpic;
    (document.getElementById('input-mid') as HTMLInputElement).checked = filter.midSpic;
    (document.getElementById('input-spic') as HTMLInputElement).checked = filter.highSpic;

    (document.getElementById('up') as HTMLInputElement).checked = filter.upAlfa;
    (document.getElementById('down') as HTMLInputElement).checked = filter.downALfa;
    (document.getElementById('lowPrice') as HTMLInputElement).checked = filter.sortLowPrice;
    (document.getElementById('highPrice') as HTMLInputElement).checked = filter.sortHighPrice;

    (document.getElementById('input-pop') as HTMLInputElement).checked = filter.popular;
  };

  static start = () => {
    const selectBtn = document.querySelector('.sort-filter__btn') as HTMLElement;
    const modalSelect = document.querySelector('.modal__sort-filter') as HTMLElement;
    const closeBtn = document.querySelector('.close__sort-filter') as HTMLElement;

    const sortUp = document.getElementById('up') as HTMLInputElement;
    const sortDown = document.getElementById('down') as HTMLInputElement;
    const sortLowPrice = document.getElementById('lowPrice') as HTMLInputElement;
    const sortHighPrice = document.getElementById('highPrice') as HTMLInputElement;

    const inputNoSpic = document.getElementById('input-nspic') as HTMLInputElement;
    const inputMidSpic = document.getElementById('input-mid') as HTMLInputElement;
    const inputHighSpic = document.getElementById('input-spic') as HTMLInputElement;

    const resetFilter = document.querySelector('.reset-filter') as HTMLElement;
    const inputPop = document.getElementById('input-pop') as HTMLInputElement;

    const deleteLocal = document.querySelector('.delete-local') as HTMLElement;

    const sliderDish = document.getElementById('slider-dish');

    const slider: noUiSlider.API = noUiSlider.create(sliderDish as HTMLElement, {
      start: [100, 999],
      connect: true,
      range: {
        min: 100,
        max: 999,
      },
    });

    const allFilter = JSON.parse(localStorage.getItem('filterDish') || '{}') as IFilterDish<boolean, number>;

    if (Object.keys(allFilter).length !== 0) {
      SortDishes.setFilter(slider, allFilter);
    }

    SortDishes.getData(slider);

    selectBtn.addEventListener('click', (): void => {
      modalSelect.style.display = 'flex';
    });

    closeBtn.addEventListener('click', (): void => {
      modalSelect.style.display = 'none';
    });

    slider.on('change', (): void => {
      const [minValue, maxValue] = slider.get(true) as number[];
      allFilter.minPrice = minValue;
      allFilter.maxPrice = maxValue;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    inputNoSpic.addEventListener('change', (): void => {
      allFilter.lowSpic = inputNoSpic.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    inputMidSpic.addEventListener('change', (): void => {
      allFilter.midSpic = inputMidSpic.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    inputHighSpic.addEventListener('change', (): void => {
      allFilter.highSpic = inputHighSpic.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    sortUp.addEventListener('change', (): void => {
      allFilter.upAlfa = sortUp.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    sortDown.addEventListener('change', (): void => {
      allFilter.downALfa = sortDown.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    sortLowPrice.addEventListener('change', (): void => {
      allFilter.sortLowPrice = sortLowPrice.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    sortHighPrice.addEventListener('change', (): void => {
      allFilter.sortLowPrice = sortHighPrice.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    inputPop.addEventListener('change', (): void => {
      allFilter.popular = inputPop.checked;
      localStorage.setItem('filterDish', JSON.stringify(allFilter));
      SortDishes.getData(slider);
    });

    resetFilter.addEventListener('click', (): void => {
      resetFilterDish.upAlfa = (document.getElementById('up') as HTMLInputElement).checked;
      resetFilterDish.downALfa = (document.getElementById('down') as HTMLInputElement).checked;
      resetFilterDish.sortLowPrice = (document.getElementById('lowPrice') as HTMLInputElement).checked;
      resetFilterDish.sortHighPrice = (document.getElementById('highPrice') as HTMLInputElement).checked;
      SortDishes.setFilter(slider, resetFilterDish);
      localStorage.setItem('filterDish', JSON.stringify(resetFilterDish));
      SortDishes.getData(slider);
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
