function stateText (type, flag) {
    let value = +type
    if (value === 1) {
        return flag ? 'error' : '待支付'
    } else if (value === 2) {
        return flag ? 'waring' : '未使用'
    } else if (value === 3) {
        return flag ? 'used' : '已消费'
    } else if (value === 5) {
        return flag ? 'error' : '已退款'
    } else if (value === 4) {
        return flag ? 'waring' : '退款审核中'
    }
}

export {
    stateText
}
