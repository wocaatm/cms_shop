//正整数的正则表达式
function isPositiveNum(s){
    var re = /^[0-9]*[1-9][0-9]*$/ ;  
    return re.test(s)  
}

//向父级上查找node
function searchParentNode(target, nodeName) {
    while (target.nodeName.toLowerCase() !== nodeName) {
        target = target.parentNode
    }
    return target
}

//对数组给定下标数组一次去除
function sliceArray(target, indexs) {
    var newTarget = []
    if (!(indexs instanceof Array && target instanceof Array)) return
    indexs.forEach(function (index) {
        target[index] = -1
    })
    target.forEach(function (item) {
        if (item !== -1) {
            newTarget.push(item)
        }
    })
    target = []
}

//只替换已有属性的属性值
function assignObj (target, obj) {
    var newObj = {}
    for (var i in target) {
        if (obj.hasOwnProperty(i)) {
            newObj[i] = obj[i]
        } else {
            newObj[i] = target[i]
        }
    }
    return newObj
}

//手机验证正则
function checkTelephone (telphone) { 
    return /^1[34578]\d{9}$/.test(telphone)
}

export {
    isPositiveNum,
    searchParentNode,
    sliceArray,
    assignObj,
    checkTelephone
}