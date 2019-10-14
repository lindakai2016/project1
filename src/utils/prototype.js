import moment from "moment";

String.prototype.validPhone = function() {
    let reg = /^1\d{10}$/;
    return reg.test(this);
}

String.prototype.validPass = function() {
    // 密码由数字、英文和下划线组成，长度6-20
    let reg = /^[0-9A-Za-z_]{6,20}$/;
    return reg.test(this);
}

String.prototype.validName = function() {
    let reg = /^[\u4E00-\u9FA5]{2,4}$/;
    return reg.test(this);
}

String.prototype.validRideNum = function() {
    let n = Number(this) || 0;
    return n >= 1 && n <= 10;
}

String.prototype.fmtPhone = function (c = " ") {
    // 158 1026 9653
    let reg = new RegExp("(?<=^\\d{3}(\\d{4})?)\\B", "g");
	return this.replace(reg, c);
}

window.location.parse = function() {
	let obj = {};
	this.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => obj[k] = v);
	return obj;
}

Array.range = function(s, d) {
    if(s > d) {
        return [];
    }
    return [...Array(d - s + 1).keys()].map(e => e + s);
}

Storage.prototype.getItemObj = function(key) {
    return JSON.parse(this.getItem(key));
}

Storage.prototype.setItemObj = function(key, val) {
    return this.setItem(key, JSON.stringify(val));
}

Date.curWeek = function () {
    let s = moment().weekday(1).format('YYYY-MM-DD');
    let d = moment().weekday(7).format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curMonth = function () {
    let s = moment().add(0, 'month').format('YYYY-MM') + '-01';
    let d = moment(s).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curYear = function() {
    let s = moment().year(moment().year()).startOf('year').valueOf();
    let d = moment().year(moment().year()).endOf('year').valueOf();
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curQuarter = function() {
    let cQ = moment().quarter();
    let cY = moment().year();
    let s = moment(moment(moment(cY + '-01-01').toDate()).quarter(cQ)).format('YYYY-MM-DD');
    let d = moment(s).add(1, 'quarter').add(-1, 'days').format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curWeekToday = function () {
    let s = moment().weekday(1).format('YYYY-MM-DD');
    let d = moment().format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curMonthToday = function () {
    let s = moment().add(0, 'month').format('YYYY-MM') + '-01';
    let d = moment().format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curYearToday = function() {
    let s = moment().year(moment().year()).startOf('year').valueOf();
    let d = moment().format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}

Date.curQuarterToday = function() {
    let cQ = moment().quarter();
    let cY = moment().year();
    let s = moment(moment(moment(cY + '-01-01').toDate()).quarter(cQ)).format('YYYY-MM-DD');
    let d = moment().format('YYYY-MM-DD');
    s = new Date(s).setHours(0, 0, 0);
    d = new Date(d).setHours(23, 59, 59);
    return [new Date(s), new Date(d)];
}