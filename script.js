document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const statusMessageDiv = document.getElementById('statusMessage');
    const deliveryDateInput = document.getElementById('deliveryDate');

    // Set minimum date to tomorrow from current date
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    const minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    deliveryDateInput.setAttribute('min', minDate);

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission (page reload)

        statusMessageDiv.classList.add('hidden'); // Hide any previous status messages
        statusMessageDiv.classList.remove('success', 'error');

        const messageContent = document.getElementById('messageContent').value.trim();
        const deliveryDate = document.getElementById('deliveryDate').value; // YYYY-MM-DD string

        // Client-side validation
        if (!messageContent || !deliveryDate) {
            showStatus('Please write your message and select a reveal date.', 'error');
            return;
        }

        const chosenDate = new Date(deliveryDate + 'T00:00:00'); // Add T00:00:00 to treat as UTC midnight for consistent comparison
        const now = new Date();

        if (chosenDate < now) {
            showStatus('The reveal date must be in the future.', 'error');
            return;
        }

        try {
            // Prepare the message object to store
            const messageToStore = {
                messageContent: messageContent,
                deliveryDate: deliveryDate // Store as YYYY-MM-DD string
            };

            // Store in Local Storage
            localStorage.setItem('futureMessage', JSON.stringify(messageToStore));

            showStatus('Your message has been stored! Remember to come back to this same browser on the reveal date.', 'success');
            messageForm.reset(); // Clear the form fields
            deliveryDateInput.setAttribute('min', minDate); // Reset min date for next entry
        } catch (error) {
            console.error('Error storing message in local storage:', error);
            showStatus('Could not store your message. Your browser\'s storage might be full or disabled.', 'error');
        }
    });

    // Helper function to display status messages
    function showStatus(message, type) {
        statusMessageDiv.textContent = message;
        statusMessageDiv.classList.remove('hidden');
        statusMessageDiv.classList.add(type);
    }
});
