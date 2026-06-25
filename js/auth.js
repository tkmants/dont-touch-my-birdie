// =====================================================
// Don't Touch My Birdie! — Auth & User System
// Uses localStorage for persistence
// =====================================================

const AUTH = {
  // Get current user
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('dtmb_user')) || null;
    } catch { return null; }
  },

  // Save user
  saveUser(user) {
    localStorage.setItem('dtmb_user', JSON.stringify(user));
  },

  // Get all accounts
  getAccounts() {
    try {
      return JSON.parse(localStorage.getItem('dtmb_accounts')) || {};
    } catch { return {}; }
  },

  // Save accounts
  saveAccounts(accounts) {
    localStorage.setItem('dtmb_accounts', JSON.stringify(accounts));
  },

  // Register
  register(username, email, password) {
    const accounts = this.getAccounts();
    if (accounts[email]) return { success: false, error: 'Email already registered.' };
    if (username.length < 3) return { success: false, error: 'Username must be at least 3 characters.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

    const user = {
      username,
      email,
      password, // In production this would be hashed
      createdAt: Date.now(),
      xp: 0,
      level: 1,
      streak: 0,
      lastLogin: Date.now(),
      discoveredBirds: [],
      achievements: [],
      sightings: [],
      badges: []
    };

    accounts[email] = user;
    this.saveAccounts(accounts);
    this.saveUser(user);
    return { success: true, user };
  },

  // Login
  login(email, password) {
    const accounts = this.getAccounts();
    const account = accounts[email];
    if (!account) return { success: false, error: 'No account found with this email.' };
    if (account.password !== password) return { success: false, error: 'Incorrect password.' };

    // Update last login & streak
    const now = Date.now();
    const lastLogin = account.lastLogin || 0;
    const daysSince = (now - lastLogin) / (1000 * 60 * 60 * 24);
    if (daysSince >= 1 && daysSince < 2) {
      account.streak = (account.streak || 0) + 1;
    } else if (daysSince >= 2) {
      account.streak = 1;
    }
    account.lastLogin = now;

    accounts[email] = account;
    this.saveAccounts(accounts);
    this.saveUser(account);
    return { success: true, user: account };
  },

  // Logout
  logout() {
    localStorage.removeItem('dtmb_user');
    window.location.href = 'auth.html';
  },

  // Add XP
  addXP(amount, reason = '') {
    const user = this.getUser();
    if (!user) return null;
    user.xp = (user.xp || 0) + amount;

    // Level calculation: each level requires 200 * level XP
    let totalXPNeeded = 0;
    let level = 1;
    while (totalXPNeeded + 200 * level <= user.xp) {
      totalXPNeeded += 200 * level;
      level++;
    }
    const didLevelUp = level > (user.level || 1);
    user.level = level;

    // Update accounts too
    const accounts = this.getAccounts();
    if (accounts[user.email]) {
      accounts[user.email] = { ...accounts[user.email], xp: user.xp, level: user.level };
      this.saveAccounts(accounts);
    }

    this.saveUser(user);
    return { user, didLevelUp, newLevel: level, xpAdded: amount };
  },

  // Discover a bird
  discoverBird(birdId) {
    const user = this.getUser();
    if (!user) return null;
    if (!user.discoveredBirds) user.discoveredBirds = [];
    if (user.discoveredBirds.includes(birdId)) return { alreadyDiscovered: true };

    user.discoveredBirds.push(birdId);
    const accounts = this.getAccounts();
    if (accounts[user.email]) {
      accounts[user.email].discoveredBirds = user.discoveredBirds;
      this.saveAccounts(accounts);
    }
    this.saveUser(user);
    return { success: true };
  },

  // Check and unlock achievements
  checkAchievements() {
    const user = this.getUser();
    if (!user) return [];
    const discovered = (user.discoveredBirds || []).length;
    const newAchievements = [];

    const achievementDefs = [
      { id: 'first_bird', name: 'First Sighting', icon: '🐦', threshold: 1, type: 'discovered', xp: 50 },
      { id: 'bird_watcher', name: 'Bird Watcher', icon: '🔭', threshold: 5, type: 'discovered', xp: 100 },
      { id: 'fledgling', name: 'Fledgling Explorer', icon: '🌿', threshold: 10, type: 'discovered', xp: 150 },
      { id: 'eagle_expert', name: 'Eagle Expert', icon: '🦅', threshold: 20, type: 'discovered', xp: 250 },
      { id: 'conservation_hero', name: 'Conservation Hero', icon: '🌍', threshold: 30, type: 'discovered', xp: 400 },
      { id: 'wetland_explorer', name: 'Wetland Explorer', icon: '🌊', threshold: 3, type: 'wetland', xp: 100 },
    ];

    achievementDefs.forEach(def => {
      if (!(user.achievements || []).includes(def.id)) {
        let met = false;
        if (def.type === 'discovered' && discovered >= def.threshold) met = true;
        if (met) {
          if (!user.achievements) user.achievements = [];
          user.achievements.push(def.id);
          newAchievements.push(def);
          this.addXP(def.xp, `Achievement: ${def.name}`);
        }
      }
    });

    if (newAchievements.length > 0) {
      const accounts = this.getAccounts();
      const currentUser = this.getUser();
      if (accounts[currentUser.email]) {
        accounts[currentUser.email].achievements = currentUser.achievements;
        this.saveAccounts(accounts);
      }
    }

    return newAchievements;
  },

  // Get XP progress for current level
  getXPProgress() {
    const user = this.getUser();
    if (!user) return { current: 0, needed: 200, percent: 0 };
    const level = user.level || 1;
    const xp = user.xp || 0;

    let xpForPrevLevels = 0;
    for (let i = 1; i < level; i++) xpForPrevLevels += 200 * i;

    const xpInLevel = xp - xpForPrevLevels;
    const xpNeededForLevel = 200 * level;
    return {
      current: xpInLevel,
      needed: xpNeededForLevel,
      percent: Math.min(100, Math.round((xpInLevel / xpNeededForLevel) * 100))
    };
  },

  // Add a sighting
  addSighting(sighting) {
    const user = this.getUser();
    if (!user) return false;
    if (!user.sightings) user.sightings = [];
    sighting.id = Date.now();
    sighting.userId = user.email;
    user.sightings.push(sighting);

    const accounts = this.getAccounts();
    if (accounts[user.email]) {
      accounts[user.email].sightings = user.sightings;
      this.saveAccounts(accounts);
    }
    this.saveUser(user);

    // Also add to global sightings
    const global = JSON.parse(localStorage.getItem('dtmb_sightings') || '[]');
    global.push(sighting);
    localStorage.setItem('dtmb_sightings', JSON.stringify(global));
    return true;
  },

  // Is user logged in?
  isLoggedIn() {
    return this.getUser() !== null;
  }
};

// ─── Shared navbar rendering ───
function renderNavbar(activePage = '') {
  const user = AUTH.getUser();
  const theme = localStorage.getItem('dtmb_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);

  const navHtml = `
  <nav class="navbar">
    <a href="index.html" class="navbar-brand">
      <img src="logo.png" alt="Logo" class="navbar-logo">
      <span class="navbar-brand-text">Don't Touch My Birdie!</span>
    </a>
    <ul class="navbar-nav">
      <li><a href="index.html" class="${activePage==='home'?'active':''}">Home</a></li>
      <li><a href="birddex.html" class="${activePage==='birddex'?'active':''}">BirdDex</a></li>
      <li><a href="map.html" class="${activePage==='map'?'active':''}">Explore Map</a></li>
      <li><a href="identify.html" class="${activePage==='identify'?'active':''}">Identify a Bird</a></li>
      <li><a href="report.html" class="${activePage==='report'?'active':''}">Report Sighting</a></li>
      <li><a href="achievements.html" class="${activePage==='achievements'?'active':''}">Achievements</a></li>
      <li><a href="mission.html" class="${activePage==='mission'?'active':''}">Mission</a></li>
    </ul>
    <div class="navbar-actions">
      <button class="btn-icon" id="theme-toggle" title="Toggle dark mode" onclick="toggleTheme()">
        ${theme === 'dark' ? '☀️' : '🌙'}
      </button>
      ${user ? `
        <a href="achievements.html" class="level-badge">
          Lv.${user.level || 1} · ${user.username}
        </a>
        <button class="btn btn-sm btn-secondary" onclick="AUTH.logout()">Logout</button>
      ` : `
        <a href="auth.html" class="btn btn-sm btn-primary">Sign In</a>
      `}
      <button class="hamburger" onclick="toggleMobileMenu()" id="hamburger-btn">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <a href="index.html" class="${activePage==='home'?'active':''}">🏠 Home</a>
    <a href="birddex.html" class="${activePage==='birddex'?'active':''}">📖 BirdDex</a>
    <a href="map.html" class="${activePage==='map'?'active':''}">🗺️ Explore Map</a>
    <a href="identify.html" class="${activePage==='identify'?'active':''}">🔍 Identify a Bird</a>
    <a href="report.html" class="${activePage==='report'?'active':''}">📍 Report Sighting</a>
    <a href="achievements.html" class="${activePage==='achievements'?'active':''}">🏆 Achievements</a>
    <a href="mission.html" class="${activePage==='mission'?'active':''}">🌿 Mission</a>
    ${user ? `<button class="btn btn-sm btn-secondary" style="margin-top:8px;width:100%" onclick="AUTH.logout()">Logout</button>` : `<a href="auth.html" class="btn btn-primary" style="margin-top:8px;text-align:center">Sign In</a>`}
  </div>
  `;

  const container = document.getElementById('navbar-mount');
  if (container) container.innerHTML = navHtml;
}

function toggleTheme() {
  const current = localStorage.getItem('dtmb_theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('dtmb_theme', next);
  document.documentElement.setAttribute('data-theme', next);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

// ─── Toast notifications ───
function showToast(message, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', warning: '⚠️', error: '❌', xp: '⭐' };
  toast.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ─── XP Gain popup ───
function showXPGain(amount, x, y) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.textContent = `+${amount} XP`;
  popup.style.left = (x || window.innerWidth / 2 - 30) + 'px';
  popup.style.top = (y || window.innerHeight / 2) + 'px';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1600);
}

// ─── Status badge helper ───
function getStatusBadge(status) {
  const map = {
    'Common': 'badge-common',
    'Rare': 'badge-rare',
    'Endangered': 'badge-endangered',
    'Extinct': 'badge-extinct'
  };
  const cls = map[status] || 'badge-common';
  const dots = { 'Common': '🟢', 'Rare': '🟡', 'Endangered': '🔴', 'Extinct': '⚫' };
  return `<span class="badge ${cls}">${dots[status] || ''} ${status}</span>`;
}

// ─── Apply theme on load ───
(function() {
  const theme = localStorage.getItem('dtmb_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
