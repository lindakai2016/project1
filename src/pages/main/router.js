
import main from "./index";
import home from "./home";
import orderList from "./orderList";
import accountList from "./accountList";
import bookCar from "./bookCar";
import orderListRV from "./orderList/routerView";

import pubOrderDetail from "./orderList/components/pubOrderDetail";

export default [
    {
        path: '/home',
        component: main,
        children: [
            {
                path: "",
                component: home,
                meta: { auth: true },
            },
            {
                path: "/order",
                component: orderListRV,
                meta: { auth: true },
                children: [
                    {
                        path: "",
                        component: orderList,
                    },
                    {
                        name: "editOrder",
                        path: "edit",
                        component: bookCar,
                        meta: {nofresh: true},
                    },
                ]
            },
            {
                path: "/account",
                component: accountList,
                meta: { auth: true },
            },
            {
                path: "/book",
                component: bookCar,
                meta: { auth: true },
            },
            {
                path: "/pubOrder",
                component: pubOrderDetail,
            }
        ],
    },
]
