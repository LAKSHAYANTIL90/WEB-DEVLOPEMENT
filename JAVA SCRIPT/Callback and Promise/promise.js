console.log('Lakshay is good in programming');

let prom1 = new Promise((resolve, reject)=>{
    let a = Math.random()
    if (a < 0.5) {
        reject("No random number was supporting you")
    }
    else{
        setTimeout(() => {
        console.log("Yes i am done")
        resolve("Lakshay")
        }, 3000)
    }
})

let prom2 = new Promise((resolve, reject)=>{
    let a = Math.random()
    if (a < 0.5) {
        reject("No random number was supporting you 2")
    }
    else{
        setTimeout(() => {
        console.log("Yes i am done 2")
        resolve("Lakshay 2")
        }, 1800)
    }
})
let p3 = Promise.race([prom1, prom2])
p3.then((a) => {
    console.log(a)
}).catch(err => {
    console.log(err)
})