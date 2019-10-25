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
            return unescape(document.cookie.substring(c_start,c_end))
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


// bid=901
// shopInfo=think%3A%7B%22name%22%3A%22%25E9%2587%2591%25E8%2589%25B2%25E9%25A3%259E%25E9%25B9%25B0%25E5%25BE%25AE%25E5%2595%2586%25E5%259F%258E%22%2C%22sub_id%22%3A%221487101192%22%7D;
// jsfyopenid=ok-q81AgsBT0FyXhacRwz3xWzlQE;
// openid=ov2M6t1RMtqNAswknwkRx7--l538;
// userInfo=think%3A%7B%22memberid%22%3A%221%22%2C%22tel%22%3A%2218669864223%22%2C%22wecha_id%22%3A%22ov2M6t1RMtqNAswknwkRx7--l538%22%2C%22wechaname%22%3A%22Journey%22%2C%22sex%22%3A%221%22%2C%22portrait%22%3A%22http%253A%252F%252Fthirdwx.qlogo.cn%252Fmmopen%252Fvi_32%252FjGSFiaC2hK1mxwKgic1YYjvsyZ2XKic7cy8NrYOwGkpUYKSbuvRzfJXrTApWTpYRPXEEic3vEIMpOzkfmII2dGeqyA%252F132%22%2C%22city%22%3A%22%22%2C%22province%22%3A%22%22%2C%22jfywecha_id%22%3Anull%2C%22issub%22%3A0%7D

