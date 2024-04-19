import { logout, auth } from "./auth.js"; // Import the logout function

// User Button
const avatar = document.getElementById('avatar');
const dropdownMenu = document.getElementById('dropdown-menu');

avatar.addEventListener('click', function() {
    dropdownMenu.classList.toggle('show');
});

// Hide dropdown menu when clicking outside of it
document.addEventListener('click', function(event) {
    if (!dropdownMenu.contains(event.target) && event.target !== avatar) {
        dropdownMenu.classList.remove('show');
    }
});

// Add user email dynamically
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('user-email').textContent = user.email; // Get the email of the currently logged in user
        const userImage = document.getElementById('avatar');
        userImage.alt = "User"; // Optional: Set alt attribute for accessibility
        if (user.photoURL) {
            userImage.src = user.photoURL; // Set the src attribute of the user's image
        } else {
            userImage.src = "https://www.w3schools.com/howto/img_avatar.png"; // Set a default image if user's image URL is not available
        }
    }
});

// Logout functionality
const logoutLink = document.querySelector('.logout');
logoutLink.addEventListener('click', async function(event) {
    event.preventDefault();
    try {
        await logout(); // Call the logout function
        // Redirect or show success message
        console.log('User logged out successfully');
        window.location.href = './index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Display error message to the user
    }
});
