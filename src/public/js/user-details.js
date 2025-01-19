document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        console.error('User ID is null');
        return;
    }

    console.log('Fetching details for user ID:', userId);

    // Fetch user basic info
    fetch(`/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            console.log('Fetched user:', user);
            const userInfo = document.getElementById('user-info');
            userInfo.innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${user.firstName} ${user.lastName}</span>
                    </div>
                    <div class="info-item">
                        <label>Email:</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="info-item">
                        <label>Status:</label>
                        <span>${user.status}</span>
                    </div>
                    <div class="info-item">
                        <label>Created:</label>
                        <span>${new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            document.getElementById('user-info').innerHTML = '<p>Error loading user information</p>';
        });

    // Fetch user metadata
    fetch(`/metadata/user/${userId}`)
        .then(response => response.json())
        .then(metadata => {
            console.log('Fetched metadata:', metadata);
            const metadataDiv = document.getElementById('user-metadata');
            if (metadata.length > 0) {
                metadataDiv.innerHTML = `
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${metadata.map(m => `
                                <tr>
                                    <td>${m.keyName}</td>
                                    <td>${m.value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                metadataDiv.innerHTML = '<p>No metadata available</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching metadata:', error);
            document.getElementById('user-metadata').innerHTML = '<p>Error loading metadata</p>';
        });

    fetch(`/permissions/user/${userId}`)
        .then(response => response.json())
        .then(permissions => {
            console.log('Fetched permissions:', permissions);
            // First fetch all available permissions
            return fetch('/permissions')
                .then(response => response.json())
                .then(allPermissions => {
                    const permissionsDiv = document.getElementById('user-permissions');
                    permissionsDiv.innerHTML = `
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>Permission</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${permissions.map(p => `
                                    <tr>
                                        <td>${p.permission.permissionName}</td>
                                        <td>
                                            <button class="delete-permission" data-id="${p.id}">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="add-permission-container">
                            <select id="permission-select">
                                <option value="">Select permission...</option>
                                ${allPermissions.map(p => `
                                    <option value="${p.id}">${p.permissionName}</option>
                                `).join('')}
                            </select>
                            <button id="add-permission-btn">Add Permission</button>
                        </div>
                    `;

                    // Add event listeners
                    document.getElementById('add-permission-btn').addEventListener('click', async () => {
                        const select = document.getElementById('permission-select');
                        const permissionId = select.value;
                        if (!permissionId) {
                            alert('Please select a permission');
                            return;
                        }
                        console.log('Adding permission with ID:', permissionId);
                        await fetch('/userPermissions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, permissionId })
                        });
                        location.reload();
                    });

                    // ...existing delete permission handlers...
                    document.querySelectorAll('.delete-permission').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const permissionId = btn.dataset.id;
                            console.log('Deleting permission with ID:', permissionId);
                            await fetch('/userPermissions/' + permissionId, { method: 'DELETE' });
                            location.reload();
                        });
                    });
                });
        })
        .catch(error => {
            console.error('Error fetching user permissions:', error);
        });

    // Fetch user audit logs
    fetch(`/auditlogs/user/${userId}`)
        .then(response => response.json())
        .then(logs => {
            console.log('Fetched audit logs:', logs);
            const logsDiv = document.getElementById('user-audit-logs');
            if (logs.length > 0) {
                logsDiv.innerHTML = `
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.map(log => `
                                <tr>
                                    <td>${log.action}</td>
                                    <td>${new Date(log.actionTimestamp).toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                logsDiv.innerHTML = '<p>No activity recorded</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching audit logs:', error);
            document.getElementById('user-audit-logs').innerHTML = '<p>Error loading audit logs</p>';
        });

    // Fetch user activities
    fetch(`/activities/user/${userId}`)
        .then(response => response.json())
        .then(activities => {
            console.log('Fetched activities:', activities);
            const logsDiv = document.createElement('div');
            logsDiv.innerHTML = '<h2>Activities</h2>';
            if (activities.length > 0) {
                logsDiv.innerHTML += `
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>URL</th>
                                <th>Duration</th>
                                <th>Body</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activities.map(a => `
                                <tr>
                                    <td>${a.type}</td>
                                    <td>${a.url}</td>
                                    <td>${a.duration ?? ''}</td>
                                    <td>${a.body ?? ''}</td>
                                    <td>
                                        <button class="update-activity" data-id="${a.id}">Update</button>
                                        <button class="delete-activity" data-id="${a.id}">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                logsDiv.innerHTML += '<p>No activities found.</p>';
            }
            document.body.appendChild(logsDiv);

            // Add event listeners for updating and deleting an activity
            document.querySelectorAll('.update-activity').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const activityId = btn.dataset.id;
                    console.log('Updating activity with ID:', activityId);

                    // Fetch current activity data
                    const currentActivityResponse = await fetch(`/activities/${activityId}`);
                    const currentActivity = await currentActivityResponse.json();
                    console.log('Current activity data:', currentActivity);

                    // Populate the form with current values
                    document.getElementById('update-type').value = currentActivity.type;
                    document.getElementById('update-url').value = currentActivity.url;
                    document.getElementById('update-duration').value = currentActivity.duration;
                    document.getElementById('update-body').value = currentActivity.body;

                    // Show the modal
                    const modal = document.getElementById('update-activity-modal');
                    modal.style.display = 'block';

                    // Handle form submission
                    document.getElementById('update-activity-form').onsubmit = async (e) => {
                        e.preventDefault();

                        const updateData = {
                            type: document.getElementById('update-type').value,
                            url: document.getElementById('update-url').value,
                            duration: document.getElementById('update-duration').value,
                            body: document.getElementById('update-body').value
                        };

                        console.log('Updating activity with data:', updateData);

                        const response = await fetch(`/activities/${activityId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updateData)
                        });

                        const result = await response.json();
                        console.log('Update response:', result);

                        if (response.ok) {
                            location.reload();
                        } else {
                            console.error('Failed to update activity:', result);
                        }
                    };
                });
            });

            document.querySelectorAll('.delete-activity').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const activityId = btn.dataset.id;
                    console.log('Deleting activity with ID:', activityId);
                    await fetch('/activities/' + activityId, { method: 'DELETE' });
                    location.reload();
                });
            });
        })
        .catch(error => {
            console.error('Error fetching user activities:', error);
        });

    // Modal close functionality
    const modal = document.getElementById('update-activity-modal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});