// Simple in-memory storage (for demo purposes)
let users = [];
let currentUser = null;
let profiles = [];
let currentProfileIndex = 0;
let likes = [];
let matches = [];
let messages = [];

// Sample data
const sampleProfiles = [
    {
        id: 1,
        username: "SkyDancer23",
        age: 28,
        bio: "Love exploring virtual worlds and dancing! Looking for someone to share adventures with. 💃✨",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop&crop=face"
    },
    {
        id: 2,
        username: "TechWizard",
        age: 32,
        bio: "Builder and scripter in SL. When I'm not coding, I'm sailing or flying around the grid! ⚡🚁",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face"
    },
    {
        id: 3,
        username: "ArtisticSoul",
        age: 26,
        bio: "Digital artist and photographer. I create beautiful spaces in SL and love romantic sunsets. 🎨🌅",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face"
    },
    {
        id: 4,
        username: "MusicLover88",
        age: 30,
        bio: "DJ at various SL clubs! Music is my passion. Let's dance the night away! 🎵🎧",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face"
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    profiles = [...sampleProfiles];
    loadNextProfile();
});

// Auth Functions
function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simple login (in real app, you'd verify against database)
    const user = users.find(u => u.username === username);
    if (user) {
        currentUser = user;
        showApp();
    } else {
        alert('User not found. Please sign up first!');
    }
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const age = document.getElementById('signup-age').value;
    const bio = document.getElementById('signup-bio').value;
    const photo = document.getElementById('signup-photo').value;
    
    if (!username || !password || !age || !bio) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        username,
        password,
        age: parseInt(age),
        bio,
        photo: photo || 'https://via.placeholder.com/300x400/ff69b4/white?text=No+Photo'
    };
    
    users.push(newUser);
    currentUser = newUser;
    showApp();
}

function logout() {
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    
    // Clear forms
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

// App Functions
function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    showBrowse();
    loadUserProfile();
}

function showBrowse() {
    hideAllSections();
    document.getElementById('browse-section').classList.remove('hidden');
    setActiveNav(0);
    loadNextProfile();
}

function showMatches() {
    hideAllSections();
    document.getElementById('matches-section').classList.remove('hidden');
    setActiveNav(1);
    loadMatches();
}

function showProfile() {
    hideAllSections();
    document.getElementById('profile-section').classList.remove('hidden');
    setActiveNav(2);
    loadUserProfile();
}

function hideAllSections() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
}

function setActiveNav(index) {
    document.querySelectorAll('.nav-btn').forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Profile Functions
function loadNextProfile() {
    const availableProfiles = profiles.filter(p => 
        p.id !== currentUser?.id && 
        !likes.some(l => l.userId === currentUser?.id && l.profileId === p.id)
    );
    
    if (availableProfiles.length === 0) {
        document.getElementById('current-profile').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h3>No more profiles!</h3>
                <p>Check back later for new matches 💕</p>
            </div>
        `;
        return;
    }
    
    const profile = availableProfiles[Math.floor(Math.random() * availableProfiles.length)];
    
    document.getElementById('profile-img').src = profile.photo;
    document.getElementById('profile-name').textContent = profile.username;
    document.getElementById('profile-age').textContent = `Age: ${profile.age}`;
    document.getElementById('profile-bio').textContent = profile.bio;
    
    // Store current profile for like/pass actions
    window.currentProfile = profile;
}

function likeProfile() {
    if (!currentUser || !window.currentProfile) return;
    
    const like = {
        userId: currentUser.id,
        profileId: window.currentProfile.id,
        timestamp: Date.now()
    };
    
    likes.push(like);
    
    // Check for match
    const mutualLike = likes.find(l => 
        l.userId === window.currentProfile.id && 
        l.profileId === currentUser.id
    );
    
    if (mutualLike) {
        // It's a match!
        matches.push({
            user1: currentUser.id,
            user2: window.currentProfile.id,
            timestamp: Date.now()
        });
        
        showMatchNotification(window.currentProfile.username);
    }
    
    loadNextProfile();
}

function passProfile() {
    loadNextProfile();
}

function showMatchNotification(username) {
    const notification = document.createElement('div');
    notification.className = 'match-notification';
    notification.innerHTML = `
        <h3>🎉 It's a Match! 🎉</h3>
        <p>You and ${username} liked each other!</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Matches Functions
function loadMatches() {
    const userMatches = matches.filter(m => 
        m.user1 === currentUser.id || m.user2 === currentUser.id
    );
    
    const matchesList = document.getElementById('matches-list');
    
    if (userMatches.length === 0) {
        matchesList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <h3>No matches yet!</h3>
                <p>Keep browsing to find your perfect match 💕</p>
            </div>
        `;
        return;
    }
    
    matchesList.innerHTML = '';
    
    userMatches.forEach(match => {
        const partnerId = match.user1 === currentUser.id ? match.user2 : match.user1;
        const partner = profiles.find(p => p.id === partnerId) || 
                       users.find(u => u.id === partnerId);
        
        if (partner) {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.onclick = () => openChat(partner);
            
            matchCard.innerHTML = `
                <img src="${partner.photo}" alt="${partner.username}">
                <div class="info">
                    <h4>${partner.username}</h4>
                    <p>Age: ${partner.age}</p>
                </div>
            `;
            
            matchesList.appendChild(matchCard);
        }
    });
}

// Profile Management
function loadUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('my-profile-img').src = currentUser.photo;
    document.getElementById('edit-username').value = currentUser.username;
    document.getElementById('edit-age').value = currentUser.age;
    document.getElementById('edit-bio').value = currentUser.bio;
    document.getElementById('edit-photo').value = currentUser.photo;
}

function updateProfile() {
    if (!currentUser) return;
    
    const age = document.getElementById('edit-age').value;
    const bio = document.getElementById('edit-bio').value;
    const photo = document.getElementById('edit-photo').value;
    
    if (!age || !bio) {
        alert('Please fill in all fields');
        return;
    }
    
    currentUser.age = parseInt(age);
    currentUser.bio = bio;
    currentUser.photo = photo || currentUser.photo;
    
    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    document.getElementById('my-profile-img').src = currentUser.photo;
    alert('Profile updated successfully!');
}

// Chat Functions
function openChat(partner) {
    document.getElementById('chat-modal').classList.remove('hidden');
    document.getElementById('chat-partner-name').textContent = partner.username;
    window.chatPartner = partner;
    loadChatMessages();
}

function closeChat() {
    document.getElementById('chat-modal').classList.add('hidden');
    window.chatPartner = null;
}

function loadChatMessages() {
    if (!currentUser || !window.chatPartner) return;
    
    const chatMessages = messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === window.chatPartner.id) ||
        (m.senderId === window.chatPartner.id && m.receiverId === currentUser.id)
    );
    
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`;
        messageDiv.textContent = msg.text;
        messagesContainer.appendChild(messageDiv);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    
    if (!text || !currentUser || !window.chatPartner) return;
    
    const message = {
        id: Date.now(),
        senderId: currentUser.id,
        receiverId: window.chatPartner.id,
        text: text,
        timestamp: Date.now()
    };
    
    messages.push(message);
    input.value = '';
    loadChatMessages();
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
