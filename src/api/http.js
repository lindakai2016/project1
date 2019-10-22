
export default [
    
    { name: "companyInfo", url: "/account/login/info", method: "get", loading: true},
    
    { name: "phoneCode", url: "/send/verifycode", method: "post", mask: true},
    { name: "phoneLogin", url: "/phone/login", method: "post", loading: true},
    { name: "passLogin", url: "/account/login", method: "post", loading: true},
    { name: "resetPass", url: "/change/password", method: "post", loading: true},
    { name: "logout", url: "/logout", method: "post", loading: true, auth: true},

    { name: "accountList", url: "/account/list", method: "get", loading: true, auth: true},
    { name: "accountDetail", url: "/account/detail", method: "post", loading: true, auth: true},
    { name: "accountDel", url: "/account/del", method: "post", loading: true, auth: true},
    { name: "accountAdd", url: "/account/add", method: "post", loading: true, auth: true},
    { name: "accountEdit", url: "/account/update", method: "post", loading: true, auth: true},

    { name: "accountOverview", url: "/account/overview", method: "get", loading: true, auth: true},

    { name: "orderList", url: "/order/list", method: "get", loading: true, auth: true},
    { name: "orderDetail", url: "/order/detail", method: "get", loading: true, auth: true},
    { name: "orderCancel", url: "/order/cancel", method: "post", loading: true, auth: true},
    { name: "orderDel", url: "/order/del", method: "post", loading: true, auth: true},

    { name: "flyQuery", url: "/fly/query", method: "get", auth: true},  //查询航班号
    { name: "depQuery", url: "/dep/list", method: "get", auth: true},
    { name: "cityList", url: "/city/list", method: "get", auth: true},

    { name: "hisUserList", url: "/history/contact/list", method: "get", auth: true},
    { name: "delHisUser", url: "/history/contact/del", method: "post", auth: true},
    { name: "hisAddrList", url: "/history/address/list", method: "get", auth: true},
    { name: "delHisAddr", url: "/history/address/del", method: "post", auth: true},

    { name: "createOrder", url: "/order/create", method: "post", loading: true, auth: true},
    { name: "updateOrder", url: "/order/update", method: "post", loading: true, auth: true},

    { name: "lnglatFromFly", url: "/dep/info", method: "post", auth: true}, //查询站点经纬度

    { name: "pubOrderDetail", url: "/public/order/detail", method: "get"}, 
    { name: "pubOrderCancel", url: "/public/order/cancel", method: "post"}, 
]


