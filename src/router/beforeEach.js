export default (to, from, next) => {
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