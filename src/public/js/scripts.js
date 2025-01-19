console.log('Hello from scripts.js');

// ...existing code...

let fetchedUsers = []; // store all users here

fetch('/users')
  .then(response => response.json())
  .then(users => {
    fetchedUsers = users;
    console.log(users);
    // Code to display users in the HTML can be added here

    const usersTableBody = document.getElementById('users-table-body');
    if (usersTableBody) {
      users.forEach(user => {
        const row = document.createElement('tr');
        row.classList.add('clickable-row');
        
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.typeId}</td>
          <td>${user.status}</td>
          <td>${user.createdAt}</td>
          <td>
            <button class="update-button" data-id="${user.id}">Update</button>
            <button class="delete-button" data-id="${user.id}">Delete</button>
          </td>
        `;

        // Add click event to row (excluding buttons)
        row.addEventListener('click', (event) => {
          // Check if clicked element is not a button
          if (!event.target.closest('button')) {
            window.location.href = `/user-details.html?id=${user.id}`;
          }
        });

        usersTableBody.appendChild(row);
      });

      document.querySelectorAll('.update-button').forEach(button => {
        button.addEventListener('click', (event) => {
          const userId = event.target.getAttribute('data-id');
          const user = fetchedUsers.find(u => u.id == userId);
          if (!user) return;

          // Populate the modal form fields
          document.getElementById('update-id').value = user.id;
          document.getElementById('update-firstName').value = user.firstName;
          document.getElementById('update-lastName').value = user.lastName;
          document.getElementById('update-password').value = user.passwordHash || '';
          document.getElementById('update-typeId').value = user.typeId || '';
          document.getElementById('update-status').value = user.status || '';

          // Show the modal if applicable
          const updateModal = document.getElementById('update-modal');
          if (updateModal) {
            updateModal.classList.remove('hidden');
          }
        });
      });

      document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
          const userId = event.target.getAttribute('data-id');
          console.log('Deleting user with ID:', userId);
          fetch(`/users/${userId}`, {
            method: 'DELETE'
          })
          .then(() => {
            console.log('User deleted');
            location.reload(); // Reload the page to see the updated user list
          })
          .catch(error => console.error('Error deleting user:', error));
        });
      });
    } else {
      console.error('User table body element not found');
    }
  })
  .catch(error => console.error('Error fetching users:', error));
  

// Update user
document.getElementById('update-user-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const id = document.getElementById('update-id').value;
  const firstName = document.getElementById('update-firstName').value;
  const lastName = document.getElementById('update-lastName').value;
  const email = document.getElementById('update-email').value;
  const password = document.getElementById('update-password').value;
  const typeId = document.getElementById('update-typeId').value;
  const status = document.getElementById('update-status').value;

  const updateData = { firstName, lastName, email, passwordHash: password, typeId, status };
  console.log('Updating user with ID:', id, 'and data:', updateData);

  fetch(`/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  })
  .then(response => response.json())
  .then(user => {
    console.log('User updated:', user);
    location.reload(); // Reload to see changes
  })
  .catch(error => console.error('Error updating user:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  // Get references to the modal elements
  const updateModal = document.getElementById('update-modal');
  const closeModalBtn = document.getElementById('close-modal');

  // Close the modal on button click
  closeModalBtn.addEventListener('click', () => {
    updateModal.classList.add('hidden');
  });
});