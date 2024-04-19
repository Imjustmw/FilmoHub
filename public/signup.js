import { signIn, signUp, sendResetPasswordEmail } from "./auth.js"; // Import the sendResetPasswordEmail function

const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".link");

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

        pwFields.forEach(password => {
            if(password.type === "password"){
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password";
            eyeIcon.classList.replace("bx-show", "bx-hide");
        })

    })
})      

links.forEach(link => {
    link.addEventListener("click", async e => {
       e.preventDefault(); // Preventing form submit
       
       // If the link is for switching to the signup form
       if (link.classList.contains("signup-link")) {
           forms.classList.add("show-signup");
       } else { // If the link is for switching to the login form
           forms.classList.remove("show-signup");
       }
    })
})

const loginForm = document.querySelector('.form.login form');
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = loginForm.querySelector('.input[type="email"]').value;
    const password = loginForm.querySelector('.password').value;
    
    try {
      await signIn(email, password);
      console.log('User logged in successfully');
      window.location.href = './filmohub.html';
    } catch (error) {
      console.error('Login error:', error);
      document.querySelector('#error_login').innerHTML = 'Incorrect Email or Password!';
    }
});

const signupForm = document.querySelector('.form.signup form');
signupForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = signupForm.querySelector('.input[type="email"]').value;
    const password = signupForm.querySelector('.password').value;
    
    try {
      await signUp(email, password);
      console.log('User signed up successfully');
      window.location.href = './filmohub.html';
    } catch (error) {
      console.error('Signup error:', error);
      document.querySelector('#error_signup').innerHTML = 'Email Already Registered!';
    }
});

const forgotPasswordLink = document.querySelector('.forgot-pass');
forgotPasswordLink.addEventListener('click', async function(event) {
    event.preventDefault();
    
    const email = prompt('Please enter your email:');
    if (email) {
        try {
            await sendResetPasswordEmail(email);
            alert('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }
});
