// function nice(name) {
//     console.log("Hey " + name + " you are nice")
//     console.log("Hey " + name + " you are tshirt is really good")
//     console.log("Hey " + name + " your typing speed is really good! ")
// }
// nice("Aman")

function sum(a, b, c = 23) {
    // console.log(a + b)
    return a + b + c
}

result = sum(6 , 12)
result1 = sum(98 , 12)
result2 = sum(123 , 12)
console.log("The sum of these number are :" , result)
console.log("The sum of these number are :" , result1)
console.log("The sum of these number are :" , result2)


const func1 = (x)=> {
    console.log("I am an arrow function" , x)
}

func1(34)