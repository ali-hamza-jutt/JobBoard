const emailFields = document.querySelectorAll('.field');
const emailLabels = document.querySelectorAll('.label');
console.log(emailLabels)


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
