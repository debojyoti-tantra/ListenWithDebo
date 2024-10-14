function left_open(){
    document.querySelector(".left").style.left = "0"
    document.querySelector(".right").style.filter = "blur(3px)"
    document.querySelector("#cross").style.display = "block"
    document.querySelector("#cross").style.position = "fixed"
    document.querySelector("#cross").style.top = "30px"
    document.querySelector("#cross").style.right = "20px"
    document.querySelector(".playbar").style.display = "none"
}

function left_close() {
    document.querySelector(".left").style.left = "-100%"
    document.querySelector(".right").style.filter = "none"
    document.querySelector("#cross").style.display = "none"
    document.querySelector(".playbar").style.display = "flex"
}