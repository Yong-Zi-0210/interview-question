function checkType(obj){
    let typeMap = {};
    const typeStr =  'Boolean Number String Function Array Object Date RegExp Error';
    //根据typeof返回的是小写的，所以统一使用小写形式
    typeStr.split(" ").map(item => {
        typeMap[`[object ${item}]`] = item.toLowerCase();
    })
    // 类型检查
    function type(obj){
        // 如果是null直接返回'null'
        if(obj === null){
            return obj + '' // 转成字符串
        }
        return typeof obj === 'object' || typeof obj === 'function' ? 
         typeMap[Object.prototype.toString.call(obj)] || 'object' :
         typeof obj
    }
    return type(obj)
}


function checkType(obj){
    const typeStr = 'Boolean String Number Array Function Object Date Error RegExp'
    const typeMap = {}
    typeStr.split(' ').map(item => {
        typeMap[`object ${item}`] = item.toLowerCase()
    })

    function type(obj){
        if(obj === null) {
            return obj + ''
        }
        return typeof obj === 'object' || typeof obj === 'function' ? 
        typeMap[Object.prototype.toString.call(obj)] || 'object' : 
        typeof obj
    }
    return type(obj)
}
