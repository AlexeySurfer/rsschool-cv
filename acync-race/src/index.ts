import './styles.scss';
import { App } from './app';

window.onload = () => {
  const appElement = document.getElementById('app');

  if (!appElement) throw Error('App root element not found');

  const app = new App(appElement);

  const routing = [
    {
      name: 'garage',
      component: () => {
        app.renderGarage();
      },
    },
    {
      name: 'winners',
      component: () => {
        app.renderScore();
      },
    },
  ];

  const defaultRoute = {
    name: 'default',
    component: () => {
      app.renderGarage();
    },
  };

  window.onpopstate = () => {
    const currentRouteName = window.location.hash.slice(1);
    const currentRoute = routing.find((p) => p.name === currentRouteName);
    (currentRoute || defaultRoute).component();
  };
};
