// ========== INITIAL DATA ==========
const initialTrendingTopics = [
  { id: 1, hashtag: "#AI", rank: 1, mentions: 9.5, engagement: 12.8, growth: 42, category: "AI", description: "Artificial Intelligence is dominating conversations with new tools and ethical debates.", status: "up", image: "ai-topic.jpg" },
  { id: 2, hashtag: "#WorldCup", rank: 2, mentions: 8.2, engagement: 11.4, growth: 38, category: "WorldCup", description: "Global football fever continues with exciting matches worldwide.", status: "up", image: "worldcup-topic.jpg" },
  { id: 3, hashtag: "#Gaming", rank: 3, mentions: 7.4, engagement: 9.7, growth: 25, category: "Gaming", description: "Esports tournaments and new game releases keep gamers engaged.", status: "up", image: "gaming-topic.jpg" },
  { id: 4, hashtag: "#BlackPink", rank: 4, mentions: 6.8, engagement: 10.2, growth: 31, category: "BlackPink", description: "K-pop sensation breaks records with their world tour.", status: "stable", image: "blackpink-topic.jpg" },
  { id: 5, hashtag: "#TechNews", rank: 5, mentions: 5.3, engagement: 7.5, growth: 19, category: "TechNews", description: "Latest innovations in smartphones and gadgets.", status: "up", image: "technews-topic.jpg" }
];

const initialInfluencers = [
  { id: 1, name: "Khaby Lame", followers: "162M", category: "Comedy", initials: "KL" },
  { id: 2, name: "Jennie Kim", followers: "96M", category: "Music", initials: "JK" },
  { id: 3, name: "MrBeast", followers: "85M", category: "Entertainment", initials: "MB" },
  { id: 4, name: "Alan Chikin Chow", followers: "62M", category: "Education", initials: "AC" },
  { id: 5, name: "Zach King", followers: "58M", category: "Magic", initials: "ZK" }
];

const initialRecentPosts = [
  { id: 1, text: "POV: Living in 2024", handle: "@aestheticvibes", engagement: "125K" },
  { id: 2, text: "Best sunset today!", handle: "@travelwithme", engagement: "98K" },
  { id: 3, text: "World Cup Highlights!", handle: "@sports.zone", engagement: "87K" },
  { id: 4, text: "Platform", handle: "@socail.zone", engagement: "12K" }

];

// ========== FUNCTION TO GET IMAGE FOR TOPIC ==========
function getImageForTopic(id) {
  if (id === 1) return 'ai-topic.jpg';
  if (id === 2) return 'worldcup-topic.jpg';
  if (id === 3) return 'gaming-topic.jpg';
  if (id === 4) return 'blackpink-topic.jpg';
  if (id === 5) return 'technews-topic.jpg';
  return 'default-topic.jpg';
}

// All possible categories for generated topics
const allCategories = ['AI', 'WorldCup', 'Gaming', 'BlackPink', 'TechNews', 'Music', 'Movies', 'Sports', 'Fashion', 'Food', 'Travel', 'Health', 'Business', 'Science', 'Art'];
const prefixes = ['#Trending', '#Viral', '#Hot', '#Breaking', '#New', '#Popular', '#Latest', '#MustKnow', '#Insight', '#Discovery', '#Epic', '#Awesome', '#Incredible', '#Amazing', '#Ultimate'];
const suffixes = ['News', 'Update', 'Alert', 'Watch', 'Now', '2026', 'World', 'Global', 'Express', 'Daily', 'Moment', 'Spotlight', 'Focus', 'Report', 'Digest'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max, decimals = 1) {
  const value = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.round(value) : parseFloat(value.toFixed(decimals));
}

// Generate 981 additional topics (986 total - 5 existing = 981)
const additionalTopics = [];
let nextId = 6;

for (let i = 0; i < 981; i++) {
  const category = getRandomItem(allCategories);
  const prefix = getRandomItem(prefixes);
  const suffix = getRandomItem(suffixes);
  let hashtag = `${prefix}${suffix}`;
  
  if (additionalTopics.some(t => t.hashtag === hashtag) || initialTrendingTopics.some(t => t.hashtag === hashtag)) {
    hashtag = `${prefix}${suffix}${Math.floor(Math.random() * 100)}`;
  }
  
  const mentions = getRandomNumber(1.0, 25.0, 1);
  const growth = getRandomNumber(5, 85, 0);
  const engagement = getRandomNumber(3.0, 18.0, 1);
  const status = growth < 10 ? 'stable' : 'up';
  const imageName = getImageForTopic(nextId);
  
  additionalTopics.push({
    id: nextId++,
    hashtag: hashtag,
    rank: initialTrendingTopics.length + additionalTopics.length + 1,
    mentions: mentions,
    engagement: engagement,
    growth: growth,
    category: category,
    description: `${hashtag} is currently trending across social media with ${mentions}K mentions and ${growth}% growth this week.`,
    status: status,
    image: imageName
  });
}

// Combine real topics with generated topics
const allInitialTopics = [...initialTrendingTopics, ...additionalTopics];

// Working data
let trendingTopics = [];
let influencers = [];
let recentPosts = [];

// Edit mode tracking
let editingInfluencerId = null;
let editingTopicId = null;

// Filter/Sort/Search state
let currentSearch = '';
let currentCategory = 'all';
let currentSort = 'default';

// Pagination state
let currentPage = 1;
const topicsPerPage = 10;

// Chart instances
let platformChartInstance = null;
let trendGrowthChartInstance = null;
let topicsGrowthChartInstance = null;
let performanceTimelineChartInstance = null;

// ========== DATA MANAGEMENT ==========
function loadData() {
  const storedTopics = localStorage.getItem('trendingTopics');
  const storedInfluencers = localStorage.getItem('influencers');
  const storedPosts = localStorage.getItem('recentPosts');
  
  trendingTopics = storedTopics ? JSON.parse(storedTopics) : JSON.parse(JSON.stringify(allInitialTopics));
  influencers = storedInfluencers ? JSON.parse(storedInfluencers) : JSON.parse(JSON.stringify(initialInfluencers));
  recentPosts = storedPosts ? JSON.parse(storedPosts) : JSON.parse(JSON.stringify(initialRecentPosts));
  
  editingInfluencerId = null;
  editingTopicId = null;
  
  trendingTopics.forEach((topic, idx) => { topic.rank = idx + 1; });
  
  updateAnalyticsCards();
}

function saveData() {
  localStorage.setItem('trendingTopics', JSON.stringify(trendingTopics));
  localStorage.setItem('influencers', JSON.stringify(influencers));
  localStorage.setItem('recentPosts', JSON.stringify(recentPosts));
}

function resetData() {
  trendingTopics = JSON.parse(JSON.stringify(allInitialTopics));
  influencers = JSON.parse(JSON.stringify(initialInfluencers));
  recentPosts = JSON.parse(JSON.stringify(initialRecentPosts));
  trendingTopics.forEach((topic, idx) => { topic.rank = idx + 1; });
  saveData();
  
  currentSearch = '';
  currentCategory = 'all';
  currentSort = 'default';
  currentPage = 1;
  editingInfluencerId = null;
  editingTopicId = null;
  
  const searchInput = document.getElementById('global-search');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-by');
  if (searchInput) searchInput.value = '';
  if (categoryFilter) categoryFilter.value = 'all';
  if (sortSelect) sortSelect.value = 'default';
  
  renderAll();
}

// ========== BUSINESS RULES ==========
function validateMentions(mentions) {
  if (mentions < 1.0) {
    alert('❌ Minimum mentions required is 2000 (2.0K). Please enter a higher value.');
    return false;
  }
  return true;
}

function updateTopicStatus(topic) {
  if (topic.growth < 10) {
    topic.status = 'stable';
  } else {
    topic.status = 'up';
  }
}

// ========== FILTER, SORT, SEARCH ==========
function getFilteredAndSortedTopics() {
  let filtered = [...trendingTopics];
  
  if (currentSearch) {
    filtered = filtered.filter(topic => 
      topic.hashtag.toLowerCase().includes(currentSearch) ||
      topic.description.toLowerCase().includes(currentSearch)
    );
  }
  
  if (currentCategory !== 'all') {
    filtered = filtered.filter(topic => topic.category === currentCategory);
  }
  
  if (currentSort !== 'default') {
    const [field, order] = currentSort.split('-');
    filtered.sort((a, b) => {
      let valA, valB;
      if (field === 'mentions') {
        valA = a.mentions;
        valB = b.mentions;
      } else if (field === 'engagement') {
        valA = a.engagement;
        valB = b.engagement;
      } else if (field === 'growth') {
        valA = a.growth;
        valB = b.growth;
      } else {
        return 0;
      }
      return order === 'asc' ? valA - valB : valB - valA;
    });
  }
  
  filtered.forEach((topic, idx) => { topic.displayRank = idx + 1; });
  
  return filtered;
}

function getFilteredInfluencers() {
  let filtered = [...influencers];
  if (currentSearch) {
    filtered = filtered.filter(inf => 
      inf.name.toLowerCase().includes(currentSearch) || 
      inf.category.toLowerCase().includes(currentSearch)
    );
  }
  return filtered;
}

function getFilteredPosts() {
  let filtered = [...recentPosts];
  if (currentSearch) {
    filtered = filtered.filter(post => 
      post.text.toLowerCase().includes(currentSearch) || 
      post.handle.toLowerCase().includes(currentSearch)
    );
  }
  return filtered;
}

// ========== EDIT FUNCTIONS ==========
function startEditInfluencer(id) {
  editingInfluencerId = id;
  renderAll();
}

function cancelEditInfluencer() {
  editingInfluencerId = null;
  renderAll();
}

function saveEditInfluencer(id, newName) {
  const influencer = influencers.find(i => i.id === id);
  if (influencer && newName && newName.trim() !== '') {
    influencer.name = newName.trim();
    const nameParts = newName.trim().split(' ');
    influencer.initials = nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase();
    saveData();
  }
  editingInfluencerId = null;
  renderAll();
}

function startEditTopic(id) {
  editingTopicId = id;
  renderAll();
}

function cancelEditTopic() {
  editingTopicId = null;
  renderAll();
}

function saveEditTopic(id, newHashtag, newMentions, newGrowth) {
  const topic = trendingTopics.find(t => t.id === id);
  if (topic) {
    if (newMentions && !isNaN(parseFloat(newMentions))) {
      if (parseFloat(newMentions) < 2.0) {
        alert('❌ Minimum mentions required is 2000 (2.0K). Please enter a higher value.');
        editingTopicId = null;
        renderAll();
        return;
      }
      topic.mentions = parseFloat(newMentions);
    }
    
    if (newHashtag && newHashtag.trim() !== '') {
      topic.hashtag = newHashtag.trim();
      if (!topic.hashtag.startsWith('#')) topic.hashtag = '#' + topic.hashtag;
    }
    
    if (newGrowth && !isNaN(parseFloat(newGrowth))) {
      topic.growth = parseFloat(newGrowth);
    }
    
    updateTopicStatus(topic);
    saveData();
  }
  editingTopicId = null;
  renderAll();
}

function saveEditTopicFromTable(id) {
  const newHashtag = document.getElementById(`edit-table-hashtag-${id}`)?.value;
  const newMentions = document.getElementById(`edit-table-mentions-${id}`)?.value;
  const newGrowth = document.getElementById(`edit-table-growth-${id}`)?.value;
  
  const topic = trendingTopics.find(t => t.id === id);
  if (topic) {
    if (newMentions && !isNaN(parseFloat(newMentions))) {
      if (parseFloat(newMentions) < 1.0) {
        alert('❌ Minimum mentions required is 2000 (2.0K). Please enter a higher value.');
        editingTopicId = null;
        renderAll();
        return;
      }
      topic.mentions = parseFloat(newMentions);
    }
    
    if (newHashtag && newHashtag.trim() !== '') {
      topic.hashtag = newHashtag.trim();
      if (!topic.hashtag.startsWith('#')) topic.hashtag = '#' + topic.hashtag;
    }
    
    if (newGrowth && !isNaN(parseFloat(newGrowth))) {
      topic.growth = parseFloat(newGrowth);
    }
    
    updateTopicStatus(topic);
    saveData();
  }
  editingTopicId = null;
  renderAll();
}

window.startEditInfluencer = startEditInfluencer;
window.cancelEditInfluencer = cancelEditInfluencer;
window.saveEditInfluencer = saveEditInfluencer;
window.startEditTopic = startEditTopic;
window.cancelEditTopic = cancelEditTopic;
window.saveEditTopic = saveEditTopic;
window.saveEditTopicFromTable = saveEditTopicFromTable;

// ========== PAGINATION FUNCTION ==========
function goToPage(page) {
  const filtered = getFilteredAndSortedTopics();
  const totalPages = Math.ceil(filtered.length / topicsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTrendingTopicsFull();
  }
}

window.goToPage = goToPage;

// ========== RENDER FUNCTIONS ==========
function renderKPIGrid() {
  const totalTopics = trendingTopics.length;
  const totalInfluencers = influencers.length;
  const totalPosts = recentPosts.length;
  const totalRecords = totalTopics + totalInfluencers + totalPosts;
  
  const totalViralEngagement = recentPosts.reduce((sum, post) => {
    const numValue = parseFloat(post.engagement);
    return sum + (isNaN(numValue) ? 0 : numValue);
  }, 0);
  
  document.getElementById('kpiGrid').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-title"><i class="fas fa-chart-line"></i> Trending Topics</div>
      <div class="kpi-value">${totalTopics}<span class="trend-badge"><i class="fas fa-database"></i> +981 generated</span></div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:4px;">5 original + 981 generated = ${totalTopics}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title"><i class="fas fa-users"></i> Influencers</div>
      <div class="kpi-value">${totalInfluencers}<span class="trend-badge"><i class="fas fa-check-circle"></i> Active</span></div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:4px;">Top creators monitored</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title"><i class="fas fa-message"></i> Viral Posts</div>
      <div class="kpi-value">${totalPosts}<span class="trend-badge"><i class="fas fa-chart-line"></i> ${totalViralEngagement.toFixed(0)}K+ engagements</span></div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:4px;">Trending content</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title"><i class="fas fa-database"></i> Total Records</div>
      <div class="kpi-value">${totalRecords}<span class="trend-badge"><i class="fas fa-check-circle"></i> Complete</span></div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:4px;">Topics: ${totalTopics} | Influencers: ${totalInfluencers} | Posts: ${totalPosts}</div>
    </div>
  `;
}

function renderInfluencers() {
  const filtered = getFilteredInfluencers();
  const container = document.getElementById('influencersList');
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">No influencers found matching your search.</div>';
    return;
  }
  
  container.innerHTML = filtered.map(inf => {
    if (editingInfluencerId === inf.id) {
      return `
        <div class="influencer-item">
          <div class="inf-left">
            <div class="inf-avatar">${inf.initials}</div>
            <div class="inf-info">
              <input type="text" id="edit-name-${inf.id}" class="edit-input" value="${inf.name}" style="width:150px;">
              <span>${inf.category}</span>
            </div>
          </div>
          <div class="inf-right">
            <div class="inf-stats">${inf.followers}</div>
            <div class="influencer-actions">
              <button class="save-btn" onclick="saveEditInfluencer(${inf.id}, document.getElementById('edit-name-${inf.id}').value)"><i class="fas fa-save"></i> Save</button>
              <button class="cancel-btn" onclick="cancelEditInfluencer()"><i class="fas fa-times"></i> Cancel</button>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="influencer-item">
          <div class="inf-left">
            <div class="inf-avatar">${inf.initials}</div>
            <div class="inf-info">
              <h4>${inf.name}</h4>
              <span>${inf.category}</span>
            </div>
          </div>
          <div class="inf-right">
            <div class="inf-stats">${inf.followers}</div>
            <div class="influencer-actions">
              <button class="influencer-edit" onclick="startEditInfluencer(${inf.id})"><i class="fas fa-edit"></i> Edit</button>
              <button class="influencer-delete" onclick="deleteInfluencer(${inf.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');
}

function renderRecentPosts() {
  const filtered = getFilteredPosts();
  const container = document.getElementById('recentPostsList');
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
    return;
  }
  
  container.innerHTML = filtered.map(post => `
    <div class="post-item">
      <div class="post-details">
        <div class="post-text"><i class="fas fa-play-circle"></i> ${post.text}</div>
        <div class="post-handle">${post.handle}</div>
      </div>
      <div class="post-right">
        <div class="post-engagement"><i class="fas fa-heart"></i> ${post.engagement}</div>
        <div class="post-actions">
          <button class="post-delete" onclick="deletePost(${post.id})"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderTrendingPreview() {
  const filtered = getFilteredAndSortedTopics();
  const container = document.getElementById('trendingPreviewTable');
  
  document.getElementById('trendingTags').innerHTML = trendingTopics.slice(0, 10).map(topic => `<div class="tag"><i class="fas fa-hashtag"></i> ${topic.hashtag}</div>`).join('');
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">No topics found matching your search or filters.</div>';
    return;
  }
  
  container.innerHTML = filtered.slice(0, 5).map(topic => `
    <div class="preview-row">
      <span class="preview-hashtag">${topic.hashtag}</span>
      <span class="preview-mentions">${topic.mentions}K mentions</span>
    </div>
  `).join('');
}

function renderTrendingTopicsFull() {
  const filtered = getFilteredAndSortedTopics();
  
  if (filtered.length > 0) {
    const top = filtered[0];
    document.getElementById('featuredTitle').innerHTML = `${top.hashtag} Revolution`;
    document.getElementById('featuredDesc').innerHTML = top.description;
    document.getElementById('featuredGrowth').innerHTML = `<i class="fas fa-chart-line"></i> +${top.growth}% growth`;
    
    // Update the featured image to match the current top topic
    const featuredImg = document.getElementById('aiFeaturedImg');
    if (featuredImg) {
      featuredImg.src = `images/${top.image}`;
      featuredImg.onerror = function() { this.src = 'images/default-topic.jpg'; };
    }
    
  } else {
    document.getElementById('featuredTitle').innerHTML = 'No topics found';
    document.getElementById('featuredDesc').innerHTML = 'Try adjusting your search or filters.';
    document.getElementById('featuredGrowth').innerHTML = '<i class="fas fa-chart-line"></i> 0% growth';
  }
  
  const gridContainer = document.getElementById('topicsGrid');
  const isSingleCategory = currentCategory !== 'all' && filtered.length === 1;
  
  if (filtered.length === 0) {
    gridContainer.innerHTML = '<div class="no-results" style="grid-column:span 3;">No topics found matching your criteria.</div>';
  } else if (isSingleCategory) {
    const topic = filtered[0];
    if (editingTopicId === topic.id) {
      gridContainer.innerHTML = `
        <div class="single-category-view">
          <div class="detail-card">
            <div class="detail-card-image">
              <img src="images/${topic.image}" alt="${topic.hashtag}" onerror="this.src='images/default-topic.jpg'">
            </div>
            <div class="detail-card-content">
              <div class="detail-card-header">
                <div class="edit-fields">
                  <input type="text" id="edit-hashtag-${topic.id}" class="edit-input" value="${topic.hashtag}" style="width:120px; font-size:1.2rem;">
                  <span class="detail-rank">Rank #${topic.displayRank}</span>
                </div>
              </div>
              <p class="detail-description">${topic.description}</p>
              <div class="detail-stats">
                <div class="detail-stat">
                  <div class="detail-stat-label">Mentions</div>
                  <input type="number" id="edit-mentions-${topic.id}" class="edit-input" value="${topic.mentions}" step="0.1" style="width:80px; font-size:1.5rem;">
                  <span class="detail-stat-unit">K</span>
                </div>
                <div class="detail-stat">
                  <div class="detail-stat-label">Engagement</div>
                  <div class="detail-stat-value">${topic.engagement}<span class="detail-stat-unit">%</span></div>
                </div>
                <div class="detail-stat">
                  <div class="detail-stat-label">Growth</div>
                  <input type="number" id="edit-growth-${topic.id}" class="edit-input" value="${topic.growth}" style="width:80px; font-size:1.5rem;">
                  <span class="detail-stat-unit">%</span>
                </div>
              </div>
              <div class="edit-actions">
                <button class="save-btn" onclick="saveEditTopic(${topic.id}, document.getElementById('edit-hashtag-${topic.id}').value, document.getElementById('edit-mentions-${topic.id}').value, document.getElementById('edit-growth-${topic.id}').value)"><i class="fas fa-save"></i> Save Changes</button>
                <button class="cancel-btn" onclick="cancelEditTopic()"><i class="fas fa-times"></i> Cancel</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      gridContainer.innerHTML = `
        <div class="single-category-view">
          <div class="detail-card">
            <div class="detail-card-image">
              <img src="images/${topic.image}" alt="${topic.hashtag}" onerror="this.src='images/default-topic.jpg'">
            </div>
            <div class="detail-card-content">
              <div class="detail-card-header">
                <h2>${topic.hashtag}</h2>
                <span class="detail-rank">Rank #${topic.displayRank}</span>
              </div>
              <p class="detail-description">${topic.description}</p>
              <div class="detail-stats">
                <div class="detail-stat">
                  <div class="detail-stat-label">Mentions</div>
                  <div class="detail-stat-value">${topic.mentions}<span class="detail-stat-unit">K</span></div>
                </div>
                <div class="detail-stat">
                  <div class="detail-stat-label">Engagement</div>
                  <div class="detail-stat-value">${topic.engagement}<span class="detail-stat-unit">%</span></div>
                </div>
                <div class="detail-stat">
                  <div class="detail-stat-label">Growth</div>
                  <div class="detail-stat-value">+${topic.growth}<span class="detail-stat-unit">%</span></div>
                </div>
              </div>
              <div class="detail-actions">
                <button class="topic-edit-btn" onclick="startEditTopic(${topic.id})"><i class="fas fa-edit"></i> Edit Topic</button>
                <button class="detail-delete-btn" onclick="deleteTopic(${topic.id})"><i class="fas fa-trash"></i> Delete Topic</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } else {
    gridContainer.innerHTML = filtered.slice(0, 6).map(topic => {
      if (editingTopicId === topic.id) {
        return `
          <div class="topic-card">
            <div class="topic-image">
              <img src="images/${topic.image}" alt="${topic.hashtag}" onerror="this.src='images/default-topic.jpg'">
            </div>
            <div class="topic-header">
              <input type="text" id="edit-hashtag-${topic.id}" class="edit-input" value="${topic.hashtag}" style="width:100px;">
              <span class="topic-rank">#${topic.displayRank}</span>
            </div>
            <div class="topic-stats">
              <span><i class="fas fa-chart-simple"></i> <input type="number" id="edit-mentions-${topic.id}" class="edit-input" value="${topic.mentions}" step="0.1" style="width:50px;">K</span>
              <span><i class="fas fa-heart"></i> ${topic.engagement}%</span>
              <span class="growth-positive"><i class="fas fa-arrow-up"></i> <input type="number" id="edit-growth-${topic.id}" class="edit-input" value="${topic.growth}" style="width:45px;">%</span>
            </div>
            <p class="topic-description">${topic.description.substring(0, 60)}...</p>
            <div class="topic-actions" style="margin-top:10px; display:flex; gap:5px; justify-content:center;">
              <button class="save-btn" onclick="saveEditTopic(${topic.id}, document.getElementById('edit-hashtag-${topic.id}').value, document.getElementById('edit-mentions-${topic.id}').value, document.getElementById('edit-growth-${topic.id}').value)"><i class="fas fa-save"></i> Save</button>
              <button class="cancel-btn" onclick="cancelEditTopic()"><i class="fas fa-times"></i> Cancel</button>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="topic-card">
            <div class="topic-actions-top" style="position:absolute; top:10px; right:10px; display:flex; gap:5px; z-index:10;">
              <button class="topic-edit-btn" onclick="startEditTopic(${topic.id})"><i class="fas fa-edit"></i></button>
              <button class="topic-delete-btn" onclick="deleteTopic(${topic.id})"><i class="fas fa-trash"></i></button>
            </div>
            <div class="topic-image">
              <img src="images/${topic.image}" alt="${topic.hashtag}" onerror="this.src='images/default-topic.jpg'">
            </div>
            <div class="topic-header">
              <h3>${topic.hashtag}</h3>
              <span class="topic-rank">#${topic.displayRank}</span>
            </div>
            <div class="topic-stats">
              <span><i class="fas fa-chart-simple"></i> ${topic.mentions}K</span>
              <span><i class="fas fa-heart"></i> ${topic.engagement}%</span>
              <span class="growth-positive"><i class="fas fa-arrow-up"></i> +${topic.growth}%</span>
            </div>
            <p class="topic-description">${topic.description.substring(0, 80)}${topic.description.length > 80 ? '...' : ''}</p>
          </div>
        `;
      }
    }).join('');
  }
  
  // ========== PAGINATED RANKINGS TABLE ==========
  const tableBody = document.getElementById('rankingsTableBody');
  const totalPages = Math.ceil(filtered.length / topicsPerPage);
  
  const startIndex = (currentPage - 1) * topicsPerPage;
  const endIndex = startIndex + topicsPerPage;
  const paginatedTopics = filtered.slice(startIndex, endIndex);
  
  if (filtered.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="no-results">No topics found</td></tr>';
  } else {
    tableBody.innerHTML = paginatedTopics.map((topic, idx) => {
      const globalRank = startIndex + idx + 1;
      if (editingTopicId === topic.id) {
        return `
          <tr style="background: rgba(168,85,247,0.1);">
            <td>#${globalRank}</td>
            <td><input type="text" id="edit-table-hashtag-${topic.id}" class="edit-input" value="${topic.hashtag}" style="width:100px;"></td>
            <td><div class="thumb-image"><img src="images/${topic.image}" onerror="this.src='images/default-topic.jpg'"></div></td>
            <td><input type="number" id="edit-table-mentions-${topic.id}" class="edit-input" value="${topic.mentions}" step="0.1" style="width:60px;">K</td>
            <td>${topic.engagement}%</td>
            <td><input type="number" id="edit-table-growth-${topic.id}" class="edit-input" value="${topic.growth}" style="width:60px;">%</td>
            <td><span class="status-badge ${topic.status === 'up' ? 'status-up' : 'status-stable'}">${topic.status === 'up' ? '↑ Trending' : '→ Stable'}</span></td>
            <td>
              <div style="display:flex; gap:5px;">
                <button class="save-btn" onclick="saveEditTopicFromTable(${topic.id})"><i class="fas fa-save"></i> Save</button>
                <button class="cancel-btn" onclick="cancelEditTopic()"><i class="fas fa-times"></i> Cancel</button>
              </div>
            </td>
          </tr>
        `;
      } else {
        return `
          <tr>
            <td>#${globalRank}</td>
            <td><strong>${topic.hashtag}</strong></td>
            <td><div class="thumb-image"><img src="images/${topic.image}" onerror="this.src='images/default-topic.jpg'"></div></td>
            <td>${topic.mentions}K</td>
            <td>${topic.engagement}%</td>
            <td class="growth-positive">+${topic.growth}%</td>
            <td><span class="status-badge ${topic.status === 'up' ? 'status-up' : 'status-stable'}">${topic.status === 'up' ? '↑ Trending' : '→ Stable'}</span></td>
            <td>
              <div style="display:flex; gap:5px;">
                <button class="edit-btn" onclick="startEditTopic(${topic.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" onclick="deleteTopic(${topic.id})"><i class="fas fa-trash"></i> Delete</button>
              </div>
            </td>
          </tr>
        `;
      }
    }).join('');
  }
  
  // Create pagination controls
  const paginationContainer = document.getElementById('paginationControls');
  if (paginationContainer && filtered.length > topicsPerPage) {
    let paginationHTML = '<div class="pagination">';
    
    paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo; Previous</button>`;
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
      if (startPage > 2) paginationHTML += `<span class="page-dots">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) paginationHTML += `<span class="page-dots">...</span>`;
      paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next &raquo;</button>`;
    paginationHTML += `<span class="page-info">Showing ${startIndex + 1}-${Math.min(endIndex, filtered.length)} of ${filtered.length} topics</span>`;
    paginationHTML += '</div>';
    
    paginationContainer.innerHTML = paginationHTML;
  } else if (paginationContainer) {
    paginationContainer.innerHTML = '';
  }
  
  updateTopicsGrowthChart();
}

function updateTopicsGrowthChart() {
  const ctx = document.getElementById('topicsGrowthChart').getContext('2d');
  if (topicsGrowthChartInstance) topicsGrowthChartInstance.destroy();
  // Sort topics by mentions (High to Low - Big bars first)
  const sortedTopics = [...trendingTopics].sort((a, b) => b.mentions - a.mentions);
  const topTopics = trendingTopics.slice(0, 10);
  
  topicsGrowthChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { 
      labels: topTopics.map(t => t.hashtag), 
      datasets: [ 
        { 
          label: 'Mentions (K)', 
          data: topTopics.map(t => t.mentions), 
          backgroundColor: 'rgba(168,85,247,0.7)', 
          borderRadius: 6, 
          barPercentage: 0.6 
        },
        { 
          label: 'Growth %', 
          data: topTopics.map(t => t.growth), 
          backgroundColor: 'rgba(74,222,128,0.6)', 
          borderRadius: 6, 
          barPercentage: 0.6 
        }
      ] 
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: true, 
      plugins: { legend: { position: 'top', labels: { color: '#cbd5e1', font: { size: 11 } } } },
      scales: { 
        y: { 
          grid: { color: 'rgba(139,92,246,0.1)' }, 
          ticks: { color: '#94a3b8' } 
        }, 
        x: { 
          ticks: { color: '#94a3b8', maxRotation: 45, minRotation: 45 } 
        } 
      } 
    }
  });
}

// ========== UPDATE ANALYTICS CARDS ==========
function updateAnalyticsCards() {
  const totalTopics = trendingTopics.length;
  const totalInfluencers = influencers.length;
  const totalPosts = recentPosts.length;
  const totalRecords = totalTopics + totalInfluencers + totalPosts;
  
  const analyticsCardsContainer = document.querySelector('.analytics-three-cards');
  if (analyticsCardsContainer) {
    analyticsCardsContainer.innerHTML = `
      <div class="analytics-stat-card">
        <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
        <div class="stat-content">
          <h3>Trending Topics</h3>
          <div class="stat-value">${totalTopics}</div>
          <div class="stat-change positive"><i class="fas fa-plus-circle"></i> 5 original + 981 generated</div>
        </div>
      </div>
      <div class="analytics-stat-card">
        <div class="stat-icon"><i class="fas fa-users"></i></div>
        <div class="stat-content">
          <h3>Active Influencers</h3>
          <div class="stat-value">${totalInfluencers}</div>
          <div class="stat-change positive"><i class="fas fa-chart-line"></i> Top performers tracked</div>
        </div>
      </div>
      <div class="analytics-stat-card">
        <div class="stat-icon"><i class="fas fa-database"></i></div>
        <div class="stat-content">
          <h3>Total Dataset</h3>
          <div class="stat-value">${totalRecords}</div>
          <div class="stat-change positive"><i class="fas fa-check-circle"></i> Topics · Influencers · Posts</div>
        </div>
      </div>
    `;
  }
}

// Static chart functions
function buildPlatformDistribution() {
  const platformData = {
    labels: ["Instagram", "TikTok", "X (Twitter)", "YouTube", "Facebook"],
    percentages: [35, 30, 20, 10, 5],
    colors: ["#E4405F", "#25F4EE", "#1DA1F2", "#FF0000", "#1877F2"]
  };
  
  const legendDiv = document.getElementById('platformLegend');
  legendDiv.innerHTML = platformData.labels.map((label, idx) => `
    <div class="legend-item">
      <div class="color-dot" style="background: ${platformData.colors[idx]}"></div>
      <span>${label}</span>
      <strong style="margin-left: auto;">${platformData.percentages[idx]}%</strong>
    </div>
  `).join('');
  
  const ctx = document.getElementById('platformChart').getContext('2d');
  if (platformChartInstance) platformChartInstance.destroy();
  platformChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: platformData.labels, datasets: [{ data: platformData.percentages, backgroundColor: platformData.colors, borderWidth: 0, cutout: '65%' }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }
  });
}

function buildTrendGrowthChart() {
  const data = { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], mentions: [42, 48, 55, 68, 82, 98] };
  const ctx = document.getElementById('trendGrowthChart').getContext('2d');
  if (trendGrowthChartInstance) trendGrowthChartInstance.destroy();
  trendGrowthChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: data.labels, datasets: [{ label: 'Mentions (thousands)', data: data.mentions, borderColor: '#49d336', backgroundColor: '#39bc3d1a', borderWidth: 2.5, pointBackgroundColor: '#c084fc', fill: true, tension: 0.3 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { ticks: { callback: val => val + 'K', color: '#94a3b8' }, grid: { color: 'rgba(139,92,246,0.1)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
  });
}

function buildPerformanceTimelineChart() {
  const data = { labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], followers: [5, 7, 9, 11, 13, 15.2] };
  const ctx = document.getElementById('performanceTimelineChart').getContext('2d');
  if (performanceTimelineChartInstance) performanceTimelineChartInstance.destroy();
  performanceTimelineChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: data.labels, datasets: [{ label: 'New Followers (K)', data: data.followers, borderColor: '#40e346', backgroundColor: 'rgba(85, 247, 126, 0.08)', borderWidth: 3, pointBackgroundColor: '#c084fc', fill: true, tension: 0.3 }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { ticks: { callback: val => val + 'K', color: '#94a3b8' }, grid: { color: 'rgba(139,92,246,0.1)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
  });
}

function addSentimentExtra() {
  document.getElementById('sentimentExtra').innerHTML = `<div><i class="fas fa-face-grin-tongue-squint"></i> Positive: 68%</div><div><i class="fas fa-face-meh"></i> Neutral: 22%</div><div><i class="fas fa-face-frown"></i> Negative: 10%</div>`;
}

// ========== DELETE FUNCTIONS ==========
function deleteTopic(id) {
  trendingTopics = trendingTopics.filter(t => t.id !== id);
  trendingTopics.forEach((topic, idx) => { topic.rank = idx + 1; });
  saveData();
  editingTopicId = null;
  currentPage = 1;
  renderAll();
}

function deleteInfluencer(id) {
  influencers = influencers.filter(i => i.id !== id);
  saveData();
  editingInfluencerId = null;
  renderAll();
}

function deletePost(id) {
  recentPosts = recentPosts.filter(p => p.id !== id);
  saveData();
  renderAll();
}

window.deleteTopic = deleteTopic;
window.deleteInfluencer = deleteInfluencer;
window.deletePost = deletePost;

// ========== EVENT HANDLERS ==========
function setupInteractivity() {
  const searchInput = document.getElementById('global-search');
  const categoryFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-by');
  const resetBtn = document.getElementById('reset-data-btn');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase();
      currentPage = 1;
      renderAll();
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      currentPage = 1;
      renderAll();
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderAll();
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => { resetData(); });
  }
}

function renderAll() {
  renderKPIGrid();
  renderInfluencers();
  renderRecentPosts();
  renderTrendingPreview();
  renderTrendingTopicsFull();
  updateAnalyticsCards();
}

// ========== LOGIN/LOGOUT ==========
function setupLogin() {
  const loginPage = document.getElementById('login-page');
  const dashboardApp = document.getElementById('dashboard-app');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  
  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Real-time validation for email
  emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    const inputGroup = this.closest('.input-group');
    if (email && !emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('show');
      inputGroup.classList.add('error');
      inputGroup.classList.remove('success');
    } else if (email && emailRegex.test(email)) {
      emailError.textContent = '';
      emailError.classList.remove('show');
      inputGroup.classList.remove('error');
      inputGroup.classList.add('success');
    } else {
      emailError.textContent = '';
      emailError.classList.remove('show');
      inputGroup.classList.remove('error');
      inputGroup.classList.remove('success');
    }
  });
  
  // Real-time validation for password
  passwordInput.addEventListener('blur', function() {
    const password = this.value;
    const inputGroup = this.closest('.input-group');
    if (password && password.length < 10) {
      passwordError.textContent = 'Password must be at least 10 characters long.';
      passwordError.classList.add('show');
      inputGroup.classList.add('error');
      inputGroup.classList.remove('success');
    } else if (password && password.length >= 8) {
      passwordError.textContent = '';
      passwordError.classList.remove('show');
      inputGroup.classList.remove('error');
      inputGroup.classList.add('success');
    } else {
      passwordError.textContent = '';
      passwordError.classList.remove('show');
      inputGroup.classList.remove('error');
      inputGroup.classList.remove('success');
    }
  });
  
  // Clear validation on focus
  emailInput.addEventListener('focus', function() {
    const inputGroup = this.closest('.input-group');
    emailError.textContent = '';
    emailError.classList.remove('show');
    inputGroup.classList.remove('error');
    inputGroup.classList.remove('success');
  });
  
  passwordInput.addEventListener('focus', function() {
    const inputGroup = this.closest('.input-group');
    passwordError.textContent = '';
    passwordError.classList.remove('show');
    inputGroup.classList.remove('error');
    inputGroup.classList.remove('success');
  });
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Reset all error states
    let isValid = true;
    
    // Validate email
    if (!email || !emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.add('show');
      emailInput.closest('.input-group').classList.add('error');
      isValid = false;
    } else {
      emailError.textContent = '';
      emailError.classList.remove('show');
      emailInput.closest('.input-group').classList.remove('error');
      emailInput.closest('.input-group').classList.add('success');
    }
    
    // Validate password
    if (!password || password.length < 10) {
      passwordError.textContent = 'Password must be at least 10 characters long.';
      passwordError.classList.add('show');
      passwordInput.closest('.input-group').classList.add('error');
      isValid = false;
    } else {
      passwordError.textContent = '';
      passwordError.classList.remove('show');
      passwordInput.closest('.input-group').classList.remove('error');
      passwordInput.closest('.input-group').classList.add('success');
    }
    
    // If both validations pass, proceed with login
    if (isValid) {
      loginPage.style.display = 'none';
      dashboardApp.style.display = 'flex';
      loadData();
      renderAll();
    }
  });
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  const loginPage = document.getElementById('login-page');
  const dashboardApp = document.getElementById('dashboard-app');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      dashboardApp.style.display = 'none';
      loginPage.style.display = 'flex';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    });
  }
}

function setupSectionSwitching() {
  const navItems = document.querySelectorAll('#dashboard-app .nav-item[data-section]');
  const sections = ['dashboard-section', 'trending-section', 'analytics-section', 'about-section'];
  
  function switchToSection(sectionId) {
    sections.forEach(sid => {
      const section = document.getElementById(sid);
      if (section) section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    
    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(`#dashboard-app .nav-item[data-section="${sectionId.replace('-section', '')}"]`);
    if (activeNav) activeNav.classList.add('active');
    
    if (sectionId === 'trending-section' && !topicsGrowthChartInstance) {
      renderTrendingTopicsFull();
    }
    if (sectionId === 'analytics-section' && !performanceTimelineChartInstance) {
      buildPerformanceTimelineChart();
    }
  }
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = item.getAttribute('data-section');
      switchToSection(`${sectionName}-section`);
    });
  });
  
  document.querySelectorAll('.quick-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navSection = link.getAttribute('data-nav');
      if (navSection) {
        switchToSection(`${navSection}-section`);
      }
    });
  });
}

function verifyImages() {
  const aiImg = document.getElementById('aiFeaturedImg');
  if (aiImg) aiImg.onerror = function() { this.src = 'images/default-topic.jpg'; };
  const featuredImg = document.getElementById('featuredPostImg');
  if (featuredImg) featuredImg.onerror = function() { this.src = 'images/default-topic.jpg'; };
}

// ========== ADD TOPIC MODAL FUNCTIONS ==========
function openAddTopicModal() {
  const modal = document.getElementById('addTopicModal');
  if (modal) {
    modal.style.display = 'block';
    const form = document.getElementById('addTopicForm');
    if (form) form.reset();
  }
}

function closeAddTopicModal() {
  const modal = document.getElementById('addTopicModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setupModalClickOutside() {
  const modal = document.getElementById('addTopicModal');
  if (modal) {
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeAddTopicModal();
      }
    });
  }
}

function addNewTopic(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  let topicName = document.getElementById('topicName')?.value.trim();
  const mentions = parseFloat(document.getElementById('topicMentions')?.value);
  const growth = parseFloat(document.getElementById('topicGrowth')?.value);
  const description = document.getElementById('topicDescription')?.value.trim();
  const category = document.getElementById('topicCategory')?.value;
  
  if (!topicName) {
    alert('Please enter a topic name');
    return false;
  }
  
  if (isNaN(mentions) || mentions < 1.0) {
    alert('❌ Minimum mentions required is 2000 (2.0K). Please enter a valid mentions value.');
    return false;
  }
  
  if (isNaN(growth)) {
    alert('Please enter a valid growth percentage');
    return false;
  }
  
  if (!description) {
    alert('Please enter a description');
    return false;
  }
  
  if (!topicName.startsWith('#')) {
    topicName = '#' + topicName;
  }
  
  const newId = Math.max(...trendingTopics.map(t => t.id), 0) + 1;
  let engagement = (mentions * 0.8 + growth * 0.2).toFixed(1);
  let finalEngagement = parseFloat(engagement);
  
  if (finalEngagement < 0) {
    alert('❌ Engagement rate cannot be negative.');
    return false;
  }
  if (finalEngagement > 100) {
    alert('❌ Engagement rate must be between 0% and 100%.');
    return false;
  }
  
  const imageName = 'default-topic.jpg';
  const status = growth < 10 ? 'stable' : 'up';
  
  const newTopic = {
    id: newId,
    hashtag: topicName,
    rank: trendingTopics.length + 1,
    mentions: mentions,
    engagement: finalEngagement,
    growth: growth,
    category: category,
    description: description,
    status: status,
    image: imageName
  };
  
  trendingTopics.push(newTopic);
  trendingTopics.forEach((topic, idx) => { topic.rank = idx + 1; });
  saveData();
  closeAddTopicModal();
  document.getElementById('addTopicForm')?.reset();
  currentPage = Math.ceil(trendingTopics.length / topicsPerPage);
  renderAll();
  
  return false;
}

window.openAddTopicModal = openAddTopicModal;
window.closeAddTopicModal = closeAddTopicModal;
window.addNewTopic = addNewTopic;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  setupLogin();
  setupLogout();
  setupSectionSwitching();
  setupInteractivity();
  buildPlatformDistribution();
  buildTrendGrowthChart();
  buildPerformanceTimelineChart();
  addSentimentExtra();
  verifyImages();
  setupModalClickOutside();
});

// Display final count in console
console.log(`%c📊 DATASET SUMMARY`, 'color: #a855f7; font-size: 16px; font-weight: bold;');
console.log(`%cTrending Topics: ${allInitialTopics.length} (5 original + 981 generated)`, 'color: #4ade80;');
console.log(`%cInfluencers: ${initialInfluencers.length}`, 'color: #4ade80;');
console.log(`%cViral Posts: ${initialRecentPosts.length}`, 'color: #4ade80;');
console.log(`%cTOTAL RECORDS: ${allInitialTopics.length + initialInfluencers.length + initialRecentPosts.length} ✅`, 'color: #fbbf24; font-size: 14px; font-weight: bold;');
console.log(`%cPagination: ${topicsPerPage} topics per page | Total pages: ${Math.ceil(allInitialTopics.length / topicsPerPage)}`, 'color: #60a5fa;');