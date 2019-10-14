import Vue from 'vue';
import Router from 'vue-router';
import beforeEach from './beforeEach';

import loginRouter from '../pages/login/router.js';
import homeRouter from '@/pages/home/router.js';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        ...loginRouter,
        ...homeRouter,
        {
            path: '*',
            redirect: '/home'
        }, 
    ]
});

router.beforeEach(beforeEach);

// 屏蔽NavigationDuplicated错误
const oriPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return oriPush.call(this, location, onResolve, onReject);
    }
    return oriPush.call(this, location).catch(err => err);
}

export default router;
