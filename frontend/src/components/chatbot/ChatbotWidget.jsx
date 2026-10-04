import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Minimize2, Plus, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { deleteConversation, loadConversation, sendChatMessage } from '../../services/chatbotApi';

const welcome = {
  role: 'assistant',
  content: "Hello! I'm your DR Assistant. I can help with diabetic retinopathy, eye and retinal health, this website, and AI explanations such as YOLO and Grad-CAM.",
};
const quickQuestions = ['What is diabetic retinopathy?', 'What is Grad-CAM?', 'What is lesion detection?', 'How does this website work?'];

export default function ChatbotWidget() {
  const { currentUser } = useAuth();
  const storageKey = `retinaiq-chat:${currentUser?.id || 'anonymous'}`;
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    const savedId = window.localStorage.getItem(storageKey);
    loadConversation(savedId)
      .then((data) => {
        setConversationId(data.conversation_id);
        setMessages(data.messages?.length ? data.messages : [welcome]);
      })
      .catch(() => setError('Sign in again to load your conversation.'));
  }, [isOpen, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const submit = async (event, suggestedMessage = '') => {
    event?.preventDefault();
    const message = (suggestedMessage || input).trim();
    if (!message || isSending) return;
    setInput('');
    setError('');
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setIsSending(true);
    try {
      const data = await sendChatMessage(message, conversationId);
      setConversationId(data.conversation_id);
      window.localStorage.setItem(storageKey, data.conversation_id);
      setMessages((current) => [...current, { role: 'assistant', content: data.response, category: data.category }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSending(false);
    }
  };

  const newChat = async () => {
    if (conversationId && !window.confirm('Clear this conversation?')) return;
    if (conversationId) await deleteConversation(conversationId).catch(() => {});
    window.localStorage.removeItem(storageKey);
    setConversationId(null);
    setMessages([welcome]);
    setError('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="mb-3 flex h-[min(650px,calc(100vh-110px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]" aria-label="DR Assistant chat">
          <header className="flex items-center justify-between bg-sky-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/20"><Bot className="h-5 w-5 text-sky-200" /></div>
              <div><h2 className="font-semibold">DR Assistant</h2><p className="text-xs text-sky-200"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Ready to help</p></div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={newChat} className="rounded-lg p-2 text-sky-100 hover:bg-white/10" aria-label="Start a new chat" title="New chat"><Plus className="h-4 w-4" /></button>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-sky-100 hover:bg-white/10" aria-label="Minimize chat"><Minimize2 className="h-4 w-4" /></button>
            </div>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-sky-700 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>{message.content}</p>
              </div>
            ))}
            {messages.length === 1 && <div className="flex flex-wrap gap-2 pt-1">{quickQuestions.map((question) => <button key={question} type="button" onClick={(event) => submit(event, question)} className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-sky-700 hover:bg-sky-50">{question}</button>)}</div>}
            {isSending && <p className="text-xs italic text-slate-500">Thinking<span className="ml-1 animate-pulse">...</span></p>}
            {error && <div className="flex items-center justify-between gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700"><span>{error}</span><button type="button" onClick={() => setError('')} aria-label="Dismiss error"><X className="h-4 w-4" /></button></div>}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
              <label htmlFor="chatbot-message" className="sr-only">Type your question</label>
              <textarea id="chatbot-message" value={input} onChange={(event) => setInput(event.target.value.slice(0, 1200))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) submit(event); }} rows="1" placeholder="Type your question..." className="max-h-24 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
              <button type="submit" disabled={!input.trim() || isSending} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-slate-400">Educational information only, not a diagnosis.</p>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-700 text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-200" aria-label={isOpen ? 'Close DR Assistant' : 'Open DR Assistant'}>{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}</button>
    </div>
  );
}