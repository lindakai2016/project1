import Vue from "vue";
const vue = new Vue();

async function getCompanyInfo(companyCode) {
    let res = await vue.$api["companyInfo"]({ companyCode });
    if(res.code != 100200) {
        vue.$message.warning(res.message || "请求失败");
        return;
    }
    let company = res.data || {};
    localStorage.setItemObj("companyInfo", company);
    document.title = company.companyName + "企业版";
}

let routeCount = 0;

export default (to, from, next) => {
    routeCount ++;
    if(routeCount >= 30 && !to.meta.nofresh) {
        location.href = location.origin + process.env.BASE_URL + to.path.slice(1);
        return;
    }
    if(to.query.companyCode) {
        let cpyCode = to.query.companyCode;
        getCompanyInfo(cpyCode).then(() => {
            next();
        });
        return;
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