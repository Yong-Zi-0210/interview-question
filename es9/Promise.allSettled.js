function success(){
    return new Promise((resolve,reject)=>{
        resolve(0)
    })
}
function error(){
    return new Promise((resolve,reject) =>{
        reject('error')
    })
}

function settled(){
    return new Promise.allSettled(success(),error())
}
settled()

let a = res?.city