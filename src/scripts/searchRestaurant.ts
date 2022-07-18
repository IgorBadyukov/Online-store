export class SearchRestaurant {
  static search = (): void => {
    const inputSearch = document.querySelector('.input-search') as HTMLInputElement;
    inputSearch.focus();
    const noRest = document.querySelector('.no-poisk__wrapper') as HTMLElement;
    inputSearch.addEventListener('input', (): void => {
      let inputValue: string = inputSearch.value;
      inputValue = inputValue.toLowerCase();

      const cardsRestaurant = document.querySelectorAll('.card-restaurant') as NodeListOf<Element>;
      let count = 0;
      cardsRestaurant.forEach((restaurant: Element): void => {
        let title: string = (restaurant.querySelector('.card-title') as HTMLElement).innerHTML;
        title = title.toLowerCase();
        if (!title.includes(inputValue)) {
          (restaurant as HTMLElement).style.display = 'none';
          count++;
        } else {
          (restaurant as HTMLElement).style.display = 'block';
        }
      });
      if (count === cardsRestaurant.length) {
        noRest.innerHTML = 'Таких ресторанов нет';
      } else {
        noRest.innerHTML = '';
      }
    });
  };
}
