//设置cookie
function setCookie(c_name,value,expiredays){
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie=c_name+ "=" +escape(JSON.stringify(value))+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()) + ";path=/";
}

//获取cookie
function getCookie(c_name){
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1 
            var c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return JSON.parse(unescape(document.cookie.substring(c_start,c_end)))
        } 
    }
    return ""
}

//是否有cookie
function hasCookie(c_name){
    if (document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){ 
            return true;
        } 
    }
    return false;
}

//删除cookie expires为-1即可
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/";
}

export {
    setCookie,
    getCookie,
    hasCookie,
    delCookie
}

