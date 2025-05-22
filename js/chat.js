async function sendChat() {
  const senderId = localStorage.getItem('userId');
  const receiverId = localStorage.getItem('friendId');
  const message = document.getElementById('chatInput').value;
  await fetch('/api/chat/send', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ senderId, receiverId, message }) });
  alert('Pesan terkirim!');
}