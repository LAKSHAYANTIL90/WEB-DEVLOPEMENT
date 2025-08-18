// This is the first js project in which we are creating the faulty calculator//
let random = Math.random()

let a = prompt("Enter first number")
let c = prompt("Enter opertation")
let b = prompt("Enter second number")


let obj = {
    "+": "-",
    "*": "+",
    "-": "/",
    "/": "**"
}

console.log(random)
if (random > 0.1) {
    //Perform the correct operation
    console.log(`The result is ${eval(`${a} ${c} ${b}`)}`)
    alert(`The result is ${eval(`${a} ${c} ${b}`)}`)
}

else{
    //Perform the wrong operation
    c = obj[c]
    alert(`The result is ${eval(`${a} ${c} ${b}`)}`)
}