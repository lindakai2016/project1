
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
        meta: { auth: true },
        children: [
            {
                path: "",
                component: home,
            },
            {
                path: "/order",
                component: orderListRV,
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
            },
            {
                path: "/book",
                component: bookCar,
            },
            {
                path: "/pubOrder",
                component: pubOrderDetail,
            }
        ],
    },
]
