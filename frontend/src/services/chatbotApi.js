import { VITE_API_BASE_URL } from './api';

const clientStorageKey = 'retinaiq-chat-client-id';

function getClientId() {
  let clientId = window.localStorage.getItem(clientStorageKey);
  if (!clientId) {
    clientId = crypto.randomUUID();
    window.localStorage.setItem(clientStorageKey, clientId);
  }
  return clientId;
}

async function request(path = '', options = {}) {
  const response = await fetch(`${VITE_API_BASE_URL}/api/chat/${path}`, {
    ...options,
    headers: {
      'X-Chat-Client-ID': getClientId(),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'The assistant is unavailable right now.');
  }
  return data;
}

export function loadConversation(conversationId) {
  return request(conversationId ? `?conversation_id=${encodeURIComponent(conversationId)}` : '');
}

export function sendChatMessage(message, conversationId) {
  return request('', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId || undefined }),
  });
}

export function deleteConversation(conversationId) {
  return request(`?conversation_id=${encodeURIComponent(conversationId)}`, { method: 'DELETE' });
}