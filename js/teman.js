async function addFriend(friendId) {
  const userId = localStorage.getItem('userId');
  await fetch('/api/friends/request', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ userId, friendId }) });
  alert('Permintaan dikirim!');
}