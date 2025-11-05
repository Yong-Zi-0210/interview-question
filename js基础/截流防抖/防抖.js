function debounce(fn, delazy){
    let timer = null
    return function(){
        const firstClick = !timer
        if(timer){
            clearTimeout(timer)
        }
        if(firstClick){
            fn.apply(this, arguments)
        }
        timer = setTimeout(() => {
            timer = null
        }, delazy);
    }
}

// 优化第一次点击执行
function debounce(fn, delazy){
    let timer = null;
    return function(){
        const firstClick = !timer;
        if(timer){
            clearTimeout(timer)
        }
        if(firstClick){
            fn.apply(this, arguments)
        }
        timer = setTimeout(()=>{
            timer = null
        },delazy)
    }
}

// 等待一定时间后执行事件，如果在等待的过程中又触发了则重新计时
