

function subset(set){
    const result = []
    const path = []

    function backtracing(start){
        result.push([...path])
        // 终止条件 if(start >= set.length) return ,可以去掉，因为就算不去掉for循环也无法进行，会跳出继续上一步
        for(let i = start; i < set.length; i++){
            path.push(set[i])
            backtracing(i+1)
            path.pop()
        }
    }
    backtracing(0)

    return result
}
function subSet(arr){
    if(!arr.length) return []
    const res = []
    const path = []
    function backtracing(startIndex){
        res.push([...path])
        for(let i = startIndex; i < arr.length; i++){
            path.push(arr[1])
            backtracing( i + 1)
            path.pop()
        }
    }
    backtracing(0)
    return res
}