
import home from "./index";
import homePage from "./homePage";
import orderList from "./orderList";
import accountList from "./accountList";
import bookCar from "./bookCar";

export default [
    {
        path: '/home',
        component: home,
        meta: { auth: true },
        children: [
            {
                path: "",
                component: homePage,
            },
            {
                path: "/order",
                component: orderList,
            },
            {
                path: "/account",
                component: accountList,
            },
            {
                path: "/book",
                component: bookCar,
            },
        ],
    }, 
]
