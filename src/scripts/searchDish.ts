export class SearchDish {
  static search = (): void => {
    const inputSearch = document.querySelector('.input-search') as HTMLInputElement;
    inputSearch.focus();
    const noRest = document.querySelector('.no-poisk__wrapper') as HTMLElement;
    inputSearch.addEventListener('input', (): void => {
      let inputValue: string = inputSearch.value;
      inputValue = inputValue.toLowerCase();

      const cardsRestaurant = document.querySelectorAll('.card') as NodeListOf<Element>;
      let count = 0;
      cardsRestaurant.forEach((card: Element): void => {
        let title: string = (card.querySelector('.card-title') as HTMLElement).innerHTML;
        title = title.toLowerCase();
        if (!title.includes(inputValue)) {
          (card as HTMLElement).style.display = 'none';
          count++;
        } else {
          (card as HTMLElement).style.display = 'block';
        }
      });

      if (count === cardsRestaurant.length) {
        noRest.innerHTML = 'Таких блюд нет';
      } else {
        noRest.innerHTML = '';
      }
    });
  };
}
