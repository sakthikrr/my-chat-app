document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    // Username for this session
    const username = 'User' + Math.floor(Math.random() * 1000);
    
    // Load messages on page load
    loadMessages();
    
    // Add event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Function to load messages
    function loadMessages() {
        fetch('/api/messages')
            .then(response => response.json())
            .then(data => {
                messagesContainer.innerHTML = '';
                data.forEach(message => {
                    displayMessage(message);
                });
                scrollToBottom();
            })
            .catch(error => console.error('Error loading messages:', error));
    }
    
    // Function to send message
    function sendMessage() {
        const content = messageInput.value.trim();
        
        if (content !== '') {
            // Send message to server
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sender: username,
                    content: content
                })
            })
            .then(response => response.json())
            .then(data => {
                // Display the sent message
                displayMessage(data);
                messageInput.value = '';
                scrollToBottom();
            })
            .catch(error => console.error('Error sending message:', error));
        }
    }
    
    // Function to display a message
    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === username ? 'sent' : 'received'}`;
        
        const senderElement = document.createElement('div');
        senderElement.className = 'sender';
        senderElement.textContent = message.sender;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'content';
        contentElement.textContent = message.content;
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(contentElement);
        messagesContainer.appendChild(messageElement);
    }
    
    // Function to scroll to bottom of messages
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
