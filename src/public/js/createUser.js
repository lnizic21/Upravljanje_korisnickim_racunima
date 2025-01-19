document.addEventListener('DOMContentLoaded', async () => {
  const permissionsContainer = document.getElementById('permissions-container');

  // Fetch all permissions for checkboxes
  try {
    const permissionsRes = await fetch('/permissions');
    const permissions = await permissionsRes.json();
    permissions.forEach((perm) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = perm.id; // We store permission ID
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${perm.permissionName}`));
      permissionsContainer.appendChild(label);
      permissionsContainer.appendChild(document.createElement('br'));
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
  }

  // Handle form submission
  document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const typeId = document.getElementById('typeId').value;

    // Gather selected permission IDs
    const selectedPermissionIds = Array.from(
      document.querySelectorAll('#permissions-container input[type="checkbox"]:checked')
    ).map(box => box.value);

    // Gather metadata from each select
    const metaEntries = [
      { key: 'THEME',           value: document.getElementById('meta-theme').value },
      { key: 'LANGUAGE',        value: document.getElementById('meta-language').value },
      { key: 'NOTIFICATIONS',   value: document.getElementById('meta-notifications').value },
      { key: 'TIMEZONE',        value: document.getElementById('meta-timezone').value },
      { key: 'DISPLAY_MODE',    value: document.getElementById('meta-display').value },
      { key: 'EMAIL_PREFERENCES', value: document.getElementById('meta-email').value }
    ].filter(entry => entry.value.trim() !== '');

    try {
      // Single call to /users/everything
      const resp = await fetch('/users/everything', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          passwordHash: password,
          typeId,
          permissions: selectedPermissionIds,
          metadata: metaEntries
        })
      });
      if (!resp.ok) throw new Error('Request failed');
      document.getElementById('status-message').textContent =
        'User, permissions, and metadata created successfully in one request!';
    } catch (error) {
      document.getElementById('status-message').textContent = 'Error: ' + error.message;
    }
  });
});