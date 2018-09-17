import App from './app.compnent';
import LoginComponent from '../views/login/login.component';

export const routeConfig = [
    {
        path: '/',
        component: App
    }, {
        path: '/login',
        component: LoginComponent
    }, {
        path: '/new',
        component: App
    }
]