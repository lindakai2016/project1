let routeCount = 0;

export default (to, from, next) => {
    routeCount ++;
    if(routeCount >= 30 && !to.meta.nofresh) {
        location.href = location.origin + process.env.BASE_URL + to.path.slice(1);
        return;
    }
    if(to.query.companyCode) {
        let cpyCode = to.query.companyCode;
        localStorage.setItem("companyCode", cpyCode);
    }
    if(to.matched.some(e => e.meta.auth)) {
        let logininfo = localStorage.getItemObj("loginInfo") || {};
        if(!logininfo.token) {
            next("/login");
            return;
        }
    }
    next();
}