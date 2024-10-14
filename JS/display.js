console.log("Let's Write display.js");

document.querySelector(".sign-up").addEventListener("click", ()=>{
    let sign_up_box = document.querySelector(".sign-up-box")

    if (sign_up_box.style.display==="none" || sign_up_box.style.display==="") {
        setTimeout(() => {

            sign_up_box.innerHTML=`<b class="">Sign up</b>
            <input type="email" name="email" id="sign-up-email" class="" placeholder="Email">
            <input type="password" name="password" id="sign-up-create-password" class="" placeholder="Create Password">
            <input type="password" name="password" id="sign-up-confirm-password" class="" placeholder="Confirm Password">
            <button class="next">Next</button>
            <p class="already">Already have an accound?<a href="#" class="login">Login</a></p>
            <p class="or" style="color: red;">or</p>
            <button class="log-in-fb">
                <img src="./svg/fb.svg" alt="fb"> Login With Facebook
            </button>
            <button class="log-in-google">
                <img src="./svg/google.svg" alt="fb" class=""> Login With Google
            </button>`

            sign_up_box.style.display = "flex"; 
            sign_up_box.style.position = "fixed";
            sign_up_box.style.top = "45px"; 
            sign_up_box.style.right = "100px";
            sign_up_box.style.opacity = "1";

            // document.querySelector("body").style.filter = "blur(5px)";
            // document.querySelectorAll("body > *:not(.sign-up-box)").style.filter = "blur(50px)"
            
            document.querySelector(".log-in-box").style.display = "none"

        }, 10);
    } else {
        setTimeout(() => {
            sign_up_box.style.display = "none";
        }, 10);
    }
})

document.querySelector(".log-in").addEventListener("click", ()=>{
    let log_in_box = document.querySelector(".log-in-box")

    if (log_in_box.style.display==="none" || log_in_box.style.display==="") {
        setTimeout(() => {

            log_in_box.innerHTML = `<b class="">Log In</b>
            <input type="email" name="email" id="sign-up-email" class="" placeholder="Email">
            <input type="password" name="password" id="sign-up-confirm-password" class="" placeholder="Password">
            <a href="#"><p class="already" style="color: red;">Forgot Password?</p></a>
            <button class="next">Signup</button>
            <p class="already">Don't have an accound?<a href="#" class="">Login</a></p>
            <p class="or" style="color: red;">or</p>
            <button class="log-in-fb">
                <img src="./svg/fb.svg" alt="fb"> Login With Facebook
            </button>
            <button class="log-in-google">
                <img src="./svg/google.svg" alt="fb" class=""> Login With Google
            </button>`

            log_in_box.style.display = "flex"; 
            log_in_box.style.position = "fixed";
            log_in_box.style.top = "45px"; 
            log_in_box.style.right = "20px";
            log_in_box.style.opacity = "1";

            document.querySelector(".sign-up-box").style.display = "none"

        }, 10);
    } else {
        setTimeout(() => {
            log_in_box.style.display = "none"
        }, 10);
    }
})


function main() {
    let a = prompt("Enter your Name")
    if (a = a) {
        document.querySelector(".your-playlist").innerHTML = `It's Your Playlist ${a.toUpperCase()}`
    }
}

main()