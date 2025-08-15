document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return; // Stop script execution if not logged in
    }

    // --- DOM Elements ---
    const createUserForm = document.getElementById('createUserForm');
    const newUsernameInput = document.getElementById('newUsername');
    const newUserEmailInput = document.getElementById('newUserEmail');
    const newUserStatusInput = document.getElementById('newUserStatus');
    const userList = document.getElementById('userList');
    const logoutButton = document.getElementById('logoutButton');

    // --- User Data Management ---
    let users = JSON.parse(localStorage.getItem('users')) || [
        // Add some default users for demonstration
        { id: 1, username: 'trader_john', email: 'john.doe@example.com', status: 'approved' },
        { id: 2, username: 'analyst_jane', email: 'jane.smith@example.com', status: 'pending' },
        { id: 3, username: 'pro_investor', email: 'investor@example.com', status: 'revoked' },
    ];

    const saveUsers = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const renderUsers = () => {
        userList.innerHTML = '';
        if (users.length === 0) {
            userList.innerHTML = '<li class="user-item-none">No users found.</li>';
            return;
        }

        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.className = 'user-item';
            userItem.dataset.userId = user.id;

            userItem.innerHTML = `
                <span>${user.username}</span>
                <span>${user.email}</span>
                <span class="user-status ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                <div class="user-actions">
                    ${user.status === 'pending' ? '<button class="approve-btn">Approve</button>' : ''}
                    ${user.status === 'approved' ? '<button class="revoke-btn">Revoke</button>' : ''}
                    ${user.status === 'pending' ? '<button class="reject-btn">Reject</button>' : ''}
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            userList.appendChild(userItem);
        });
    };

    // --- Event Listeners ---

    // Create User
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = {
            id: Date.now(), // Simple unique ID
            username: newUsernameInput.value.trim(),
            email: newUserEmailInput.value.trim(),
            status: newUserStatusInput.value,
        };

        if (newUser.username && newUser.email) {
            users.push(newUser);
            saveUsers();
            renderUsers();
            createUserForm.reset();
        }
    });

    // User Actions (Approve, Revoke, Reject, Delete)
    userList.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;

        const button = e.target;
        const userItem = button.closest('.user-item');
        const userId = parseInt(userItem.dataset.userId, 10);

        if (button.classList.contains('approve-btn')) {
            updateUserStatus(userId, 'approved');
        } else if (button.classList.contains('revoke-btn')) {
            updateUserStatus(userId, 'revoked');
        } else if (button.classList.contains('reject-btn')) {
            updateUserStatus(userId, 'rejected');
        } else if (button.classList.contains('delete-btn')) {
            if (confirm('Are you sure you want to permanently delete this user?')) {
                deleteUser(userId);
            }
        }
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'index.html';
    });

    // --- Action Functions ---

    const updateUserStatus = (id, newStatus) => {
        users = users.map(user =>
            user.id === id ? { ...user, status: newStatus } : user
        );
        saveUsers();
        renderUsers();
    };

    const deleteUser = (id) => {
        users = users.filter(user => user.id !== id);
        saveUsers();
        renderUsers();
    };

    // --- Initial Render ---
    renderUsers();
});
