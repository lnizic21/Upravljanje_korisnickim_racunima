console.log('Hello from admin.js');

document.addEventListener('DOMContentLoaded', () => {
  // Load metadata
  fetch('/metadata')
    .then(response => response.json())
    .then(metadata => {
      const container = document.getElementById('metadata-list');
      if (container && Array.isArray(metadata)) {
        container.innerHTML = `
          <table class="styled-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              ${metadata.map(item => `
                <tr>
                  <td>${item.keyName}</td>
                  <td>${item.value}</td>
                  <td>${item.userId || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    })
    .catch(error => console.error('Error fetching metadata:', error));

  // Load audit logs
  fetch('/auditlogs')
    .then(response => response.json())
    .then(logs => {
      const container = document.getElementById('auditlog-list');
      if (container && Array.isArray(logs)) {
        container.innerHTML = `
          <table class="styled-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Timestamp</th>
                <th>User ID</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map(log => `
                <tr>
                  <td>${log.action}</td>
                  <td>${new Date(log.actionTimestamp).toLocaleString()}</td>
                  <td>${log.userId || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    })
    .catch(error => console.error('Error fetching audit logs:', error));

  // Load permissions
  fetch('/usersPermissions')
    .then(response => response.json())
    .then(permissions => {
      const container = document.getElementById('permissions-list');
      if (container && Array.isArray(permissions)) {
        container.innerHTML = `
          <table class="styled-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Permission</th>
                <th>Granted At</th>
              </tr>
            </thead>
            <tbody>
              ${permissions.map(p => `
                <tr>
                  <td>${p.user?.firstName || 'Unknown'} ${p.user?.lastName || ''}</td>
                  <td>${p.permission?.permissionName || 'Unknown Permission'}</td>
                  <td>${new Date(p.grantedAt).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    })
    .catch(error => console.error('Error fetching permissions:', error));
});