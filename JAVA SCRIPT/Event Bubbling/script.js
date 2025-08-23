let button = document.getElementById("btn")
button.addEventListener("click", ()=>{
    document.querySelector(".box").innerHTML = "<b> I was clicked </b>";
})
button.addEventListener("contextmenu", ()=>{
    alert("Dont hack us by right click please!")
})
document.addEventListener("keydown", (e)=>{
    console.log(e, e.key, e.keyCode)
})