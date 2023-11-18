const registerButton=document.getElementById('registerShift');
const loginButton=document.getElementById('loginShift');
const loginContainer=document.getElementById('loginContainer');
const registerContainer=document.getElementById('registerContainer');

const registerForm=document.getElementById('registerForm');

registerButton.addEventListener('click',()=>{
    loginContainer.classList.remove('active');
    registerContainer.classList.add('active');
})

loginButton.addEventListener('click',()=>{
    registerForm.reset();
    registerContainer.classList.remove('active');
    loginContainer.classList.add('active');
})



const emailFields = document.querySelectorAll('.field');
const emailLabels = document.querySelectorAll('.label');

emailLabels.forEach((emailLabel) => {
    emailLabel.style.transition = 'transform 0.3s';
});

// Function to reset the fields to their initial state
const resetFields = () => {
    emailFields.forEach((emailField, index) => {
        emailField.value = ''; // Clear the field
        emailLabels[index].style.transform = 'translateY(0)'; // Reset the label position
    });
};

// Add event listeners to each input field
emailFields.forEach((emailField, index) => {
    emailField.addEventListener('focus', () => {
        emailLabels[index].style.transform = 'translateY(-30px)';
    });

    emailField.addEventListener('blur', () => {
        const emailLabel = emailLabels[index];
        if (emailField.value.trim() !== '') {
            emailLabel.style.transform = 'translateY(-30px)';
        } else {
            emailLabel.style.transform = 'translateY(0)';
        }
    });
});

// Add a beforeunload event listener to reset fields when navigating to another page
window.addEventListener('beforeunload', resetFields);


const passwordInputs = document.querySelectorAll('.passwordInput');
const showPasswordIcons = document.querySelectorAll('.showPassword');

showPasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        // Toggle the type attribute of the password inputs based on the current type
        passwordInputs.forEach(input => {
            input.type = (input.type === 'password') ? 'text' : 'password';
        });
    });
});







