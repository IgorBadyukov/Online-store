import { Cart } from './cart';

const buttonAuth = document.querySelector('.button-auth') as HTMLElement;
const modalAuth = document.querySelector('.modal-auth') as HTMLElement;
const buttonOut = document.querySelector('.button-out') as HTMLElement;
const userName = document.querySelector('.user-name') as HTMLElement;
const closeAuth = document.querySelector('.close-auth') as HTMLElement;
const logInForm = document.getElementById('logInForm') as HTMLElement;
const inputLogin = document.getElementById('login') as HTMLInputElement;
const inputPassword = document.getElementById('password') as HTMLInputElement;
const buttonCart = document.querySelector('.button-cart') as HTMLElement;

export class Auth {
  static login = (user: { login: string, password: string }): void => {
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'flex';
    userName.style.display = 'flex';
    buttonCart.style.display = 'flex';
    userName.textContent = user.login;
    modalAuth.style.display = 'none';
  };

  static logout = (): void => {
    buttonAuth.style.display = 'flex';
    buttonOut.style.display = 'none';
    userName.style.display = 'none';
    buttonCart.style.display = 'none';
    userName.textContent = '';

    localStorage.removeItem('user');
  };

  static auth(): void {
    buttonAuth.addEventListener('click', (): void => {
      modalAuth.style.display = 'flex';
    });

    closeAuth.addEventListener('click', (): void => {
      modalAuth.style.display = 'none';
    });

    buttonOut.addEventListener('click', (): void => {
      Cart.resetCart();
      Auth.logout();
    });

    logInForm.addEventListener('submit', (event: SubmitEvent): void => {
      event.preventDefault();

      const user = {
        login: inputLogin.value,
        password: inputPassword.value,
      };
      if (user.login === '') {
        alert('Вы не ввели логин!'); // eslint-disable-line no-alert
      } else if (user.password === '') {
        alert('Вы не ввели пароль!'); // eslint-disable-line no-alert
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        Auth.login(user);
      }
    });

    if (localStorage.getItem('user')) {
      this.login(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }
}
