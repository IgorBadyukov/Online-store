export interface IFilterRestaurant<T, K> {
  upAlfa: T,
  downALfa: T,
  sortLowPrice: T,
  sortHighPrice: T,
  minStar: K,
  maxStar: K,
  minTime: K,
  maxTime: K,
  sushi: T,
  pizza: T,
  rus: T,
  minPrice: T,
  midPrice: T,
  maxPrice: T
}

export const resetFilterRestaurant: IFilterRestaurant<boolean, number> = {
  upAlfa: true,
  downALfa: false,
  sortLowPrice: false,
  sortHighPrice: false,
  minStar: 3,
  maxStar: 5,
  minTime: 30,
  maxTime: 80,
  sushi: false,
  pizza: false,
  rus: false,
  minPrice: false,
  midPrice: false,
  maxPrice: false,
};

export interface IFilterDish<T, K> {
  upAlfa: T,
  downALfa: T,
  sortLowPrice: T,
  sortHighPrice: T,
  minPrice: K,
  maxPrice: K,
  lowSpic: T,
  midSpic: T,
  highSpic: T,
  popular: T
}

export const resetFilterDish: IFilterDish<boolean, number> = {
  upAlfa: true,
  downALfa: false,
  sortLowPrice: false,
  sortHighPrice: false,
  minPrice: 100,
  maxPrice: 999,
  lowSpic: false,
  midSpic: false,
  highSpic: false,
  popular: false,
};
