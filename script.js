// Sample guild data (will be stored in localStorage)
let guildData = {
    players: [],
    adminPassword: "admin123" // CHANGE THIS!
};

// Initialize application
function init() {
    loadData();
    renderPlayers();
    updateMemberCount();
}

// Show/Hide Sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'players') {
        renderPlayers();
    }
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('guildData');
    if (saved) {
        guildData = JSON.parse(saved);
    } else {
        guildData.players = [];
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('guildData', JSON.stringify(guildData));
}

// Update member count
function updateMemberCount() {
    document.getElementById('stat-members').textContent = guildData.players.length;
}

// Render all players
function renderPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    playersGrid.innerHTML = '';
    
    if (guildData.players.length === 0) {
        playersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">No players added yet. Admin can add players.</p>';
        return;
    }
    
    guildData.players.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.onclick = () => showPlayerDetail(index);
        
        card.innerHTML = `
            <h3>${player.name || 'Unknown Player'}</h3>
            <div class="role">${player.role || 'No Role'}</div>
            <div class="level">Level: ${player.level || 'N/A'}</div>
            <div class="level">Class: ${player.class || 'N/A'}</div>
        `;
        
        playersGrid.appendChild(card);
    });
}

// Show player detail modal
function showPlayerDetail(index) {
    const player = guildData.players[index];
    const modal = document.getElementById('playerModal');
    const detail = document.getElementById('playerDetail');
    
    const joinDate = player.joinDate ? new Date(player.joinDate).toLocaleDateString() : 'Unknown';
    
    detail.innerHTML = `
        <div class="player-detail">
            <h2>${player.name}</h2>
            <div class="player-detail-info">
                <div class="info-item">
                    <label>Role</label>
                    <strong>${player.role || 'N/A'}</strong>
                </div>
                <div class="info-item">
                    <label>Level</label>
                    <strong>${player.level || 'N/A'}</strong>
                </div>
                <div class="info-item">
                    <label>Class</label>
                    <strong>${player.class || 'N/A'}</strong>
                </div>
                <div class="info-item">
                    <label>Join Date</label>
                    <strong>${joinDate}</strong>
                </div>
            </div>
            <div style="background: rgba(0, 212, 255, 0.1); padding: 1.5rem; border-radius: 5px; border-left: 3px solid #00d4ff; margin: 1.5rem 0;">
                <label style="color: #b0b0b0; font-size: 0.85rem;">Bio</label>
                <p style="color: #e0e0e0; margin-top: 0.5rem;">${player.bio || 'No bio provided'}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('playerModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('playerModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Admin Functions
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === guildData.adminPassword) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        renderPlayersList();
        document.getElementById('adminPassword').value = '';
    } else {
        alert('❌ Incorrect password!');
    }
}

// Render players list for admin
function renderPlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    if (guildData.players.length === 0) {
        playersList.innerHTML = '<p style="color: #b0b0b0;">No players yet. Add your first player above.</p>';
        return;
    }
    
    guildData.players.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        
        item.innerHTML = `
            <p><strong style="color: #00d4ff;">${player.name}</strong> - ${player.role} (Level ${player.level})</p>
            <div>
                <button class="btn btn-edit" onclick="editPlayer(${index})">Edit</button>
                <button class="btn btn-delete" onclick="deletePlayer(${index})">Delete</button>
            </div>
        `;
        
        playersList.appendChild(item);
    });
}

// Add new player
function addPlayer() {
    const name = document.getElementById('newPlayerName').value.trim();
    const role = document.getElementById('newPlayerRole').value.trim();
    const level = parseInt(document.getElementById('newPlayerLevel').value) || 1;
    const playerClass = document.getElementById('newPlayerClass').value.trim();
    const joinDate = document.getElementById('newPlayerJoinDate').value;
    const bio = document.getElementById('newPlayerBio').value.trim();
    
    if (!name) {
        alert('⚠️ Please enter player name');
        return;
    }
    
    const newPlayer = {
        name,
        role,
        level,
        class: playerClass,
        joinDate,
        bio
    };
    
    guildData.players.push(newPlayer);
    saveData();
    
    // Clear form
    document.getElementById('newPlayerName').value = '';
    document.getElementById('newPlayerRole').value = '';
    document.getElementById('newPlayerLevel').value = '';
    document.getElementById('newPlayerClass').value = '';
    document.getElementById('newPlayerJoinDate').value = '';
    document.getElementById('newPlayerBio').value = '';
    
    renderPlayersList();
    updateMemberCount();
    alert('✅ Player added successfully!');
}

// Edit player (inline editing)
function editPlayer(index) {
    const player = guildData.players[index];
    
    const newName = prompt('Player Name:', player.name);
    if (newName === null) return;
    
    const newRole = prompt('Role:', player.role || '');
    if (newRole === null) return;
    
    const newLevel = prompt('Level:', player.level || '1');
    if (newLevel === null) return;
    
    const newClass = prompt('Class:', player.class || '');
    if (newClass === null) return;
    
    const newBio = prompt('Bio:', player.bio || '');
    if (newBio === null) return;
    
    guildData.players[index] = {
        ...player,
        name: newName.trim(),
        role: newRole.trim(),
        level: parseInt(newLevel) || 1,
        class: newClass.trim(),
        bio: newBio.trim()
    };
    
    saveData();
    renderPlayersList();
    updateMemberCount();
    alert('✅ Player updated successfully!');
}

// Delete player
function deletePlayer(index) {
    if (confirm('Are you sure you want to delete this player?')) {
        guildData.players.splice(index, 1);
        saveData();
        renderPlayersList();
        updateMemberCount();
        alert('✅ Player deleted!');
    }
}

// Change admin password
function changeAdminPassword() {
    const newPassword = document.getElementById('newAdminPassword').value.trim();
    
    if (!newPassword) {
        alert('⚠️ Please enter a new password');
        return;
    }
    
    const confirmPassword = prompt('Confirm new password:');
    if (confirmPassword === null) return;
    
    if (newPassword === confirmPassword) {
        guildData.adminPassword = newPassword;
        saveData();
        document.getElementById('newAdminPassword').value = '';
        alert('✅ Password changed successfully!');
    } else {
        alert('❌ Passwords do not match!');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminPassword').value = '';
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
