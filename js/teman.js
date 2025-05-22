// --- SEARCH USER ---
document.getElementById('searchUser').addEventListener('input', async function() {
  const q = this.value.trim();
  if (q.length < 2) { document.getElementById('searchResult').innerHTML = ''; return; }
  const res = await fetch(`/api/users?search=${q}`);
  const users = await res.json();
  // Filter: jangan tampilkan diri sendiri
  const myId = localStorage.getItem('userId');
  document.getElementById('searchResult').innerHTML = users.filter(u => u._id !== myId).map(u => `
    <div class="result-card">
      <img src="${u.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}">
      <div class="friend-info">
        <span>${u.nama}</span>
        <div class="nim">NIM: ${u.nim}</div>
        <div class="semester">Semester: ${u.semester || '-'}</div>
      </div>
      <button class="btn-add" onclick="addFriend('${u._id}')">Tambah Teman</button>
    </div>
  `).join('');
});

// --- TAMBAH TEMAN ---
async function addFriend(friendId) {
  const userId = localStorage.getItem('userId');
  const res = await fetch('/api/friends/request', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId, friendId })
  });
  if (res.ok) alert('Permintaan dikirim!');
  else alert('Sudah pernah mengirim permintaan atau error.');
}

// --- LIST REQUEST MASUK (PERMINTAAN) ---
async function loadRequests() {
  const userId = localStorage.getItem('userId');
  const res = await fetch(`/api/friends/requests/${userId}`);
  const requests = await res.json();
  document.getElementById('requestList').innerHTML = requests.length ?
    requests.map(r => `
      <div class="friend-card">
        <img src="${r.userId.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}">
        <div class="friend-info">
          <span>${r.userId.nama}</span>
          <div class="nim">NIM: ${r.userId.nim}</div>
          <div class="semester">Semester: ${r.userId.semester || '-'}</div>
        </div>
        <button class="btn-accept" onclick="acceptFriend('${r.userId._id}')">Terima</button>
      </div>
    `).join('') : '<div style="color:#888;">Tidak ada permintaan pertemanan.</div>';
}
async function acceptFriend(friendId) {
  const userId = localStorage.getItem('userId');
  const res = await fetch('/api/friends/accept', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId, friendId })
  });
  if (res.ok) { alert('Sekarang sudah berteman!'); loadFriends(); loadRequests(); }
}

// --- LIST TEMAN SUDAH DITERIMA ---
async function loadFriends() {
  const userId = localStorage.getItem('userId');
  const res = await fetch(`/api/friends/list/${userId}`);
  const friends = await res.json();
  document.getElementById('friendList').innerHTML = friends.length ?
    friends.map(f => `
      <div class="friend-card">
        <img src="${f.friendId.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}">
        <div class="friend-info">
          <span>${f.friendId.nama}</span>
          <div class="nim">NIM: ${f.friendId.nim}</div>
          <div class="semester">Semester: ${f.friendId.semester || '-'}</div>
        </div>
        <button class="btn-chat" onclick="chatWith('${f.friendId._id}')">Chat</button>
      </div>
    `).join('') : '<div style="color:#888;">Belum ada teman.</div>';
}
function chatWith(friendId) {
  localStorage.setItem('friendId', friendId);
  window.location.href = 'chat.html';
}

window.onload = function() {
  loadRequests();
  loadFriends();
}
