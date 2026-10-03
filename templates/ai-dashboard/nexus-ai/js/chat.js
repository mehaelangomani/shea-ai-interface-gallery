(function () {
  'use strict';

  let activeChatId = null;

  const MOCK_BLOCKS = {
    'mock:travel-japan': {
      answer: 'Here\'s a structured direction for your website — clean typography, generous whitespace, and photography-led destination cards.',
      suggestions: 'Use a navy-on-white palette with soft blue accents. Navigation: Destinations, Experiences, Plan, Contact.',
      tags: ['Hero', 'Destinations', 'Gallery', 'CTA'],
      preview: 'Minimal hero with "Discover Japan", 3-column destination grid, gallery strip, sticky plan trip button.',
    },
    'mock:college-research': {
      answer: 'I compared programs across curriculum depth, research labs, internship pipelines, and alumni outcomes in AI/ML.',
      suggestions: 'Group schools into reach, match, and safety tiers. Weight faculty research overlap with your interests.',
      tags: ['Criteria', 'Shortlist', 'Timeline', 'Essays'],
      preview: 'Comparison table of 8 programs with pros/cons and application deadlines.',
    },
    'mock:portfolio-design': {
      answer: 'Lead with a bold headline, 3 featured case studies, and a concise about section. Keep motion subtle.',
      suggestions: 'Use large project thumbnails, outcome metrics, and a single primary CTA: "View work".',
      tags: ['Hero', 'Case studies', 'About', 'Contact'],
      preview: 'Wireframe: full-bleed hero, 2x2 project grid, testimonial strip.',
    },
    'mock:ai-study-plan': {
      answer: 'A 6-week plan covering Python basics, linear algebra refresh, ML intuition, and a capstone mini-project.',
      suggestions: 'Study 45–60 minutes daily. Alternate theory days with hands-on notebook days.',
      tags: ['Week 1–2', 'Week 3–4', 'Week 5', 'Capstone'],
      preview: 'Weekly checklist with resources and milestone quizzes.',
    },
    'mock:marketing-strategy': {
      answer: 'Position around actionable insights for ops teams. ICP: mid-market SaaS with fragmented analytics stacks.',
      suggestions: 'Channels: product-led content, LinkedIn thought leadership, targeted outbound to RevOps leads.',
      tags: ['ICP', 'Messaging', 'Channels', 'Metrics'],
      preview: 'One-page GTM brief with positioning statement and 90-day launch plan.',
    },
    'mock:python-examples': {
      answer: 'Here are sorting approaches with time complexity notes and when to use each in practice.',
      suggestions: 'Start with built-in sorted(), then show bubble, merge, and quicksort for learning.',
      tags: ['sorted()', 'Merge sort', 'Quick sort', 'Complexity'],
      preview: '```python\nnums = [3, 1, 4, 1, 5]\nprint(sorted(nums))\n```',
    },
  };

  function mockBlockHtml(mockKey) {
    const data = MOCK_BLOCKS[mockKey];
    if (!data) return genericAiResponse(mockKey);
    const tags = data.tags.map((t) => `<span class="structure-tag">${NexusAI.escapeHtml(t)}</span>`).join('');
    return `
      <article class="ai-block" data-mock="${mockKey}">
        <div class="ai-block-header">AI Response</div>
        <div class="ai-block-section">
          <h4>Answer</h4>
          <p class="ai-text">${NexusAI.escapeHtml(data.answer)}</p>
        </div>
        <div class="ai-block-section">
          <h4>Suggestions</h4>
          <p class="ai-text ai-text-sm">${NexusAI.escapeHtml(data.suggestions)}</p>
        </div>
        <div class="ai-block-section">
          <h4>Generated content</h4>
          <div class="structure-tags">${tags}</div>
          <div class="preview-card"><strong>Preview</strong> — ${NexusAI.escapeHtml(data.preview)}</div>
        </div>
        <div class="ai-block-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-action="copy">Copy</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="regenerate">Regenerate</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="edit">Edit</button>
          <button type="button" class="btn btn-primary btn-sm" data-action="continue">Continue</button>
        </div>
      </article>`;
  }

  function genericAiResponse(text) {
    const excerpt = String(text || '').slice(0, 120);
    return `
      <article class="ai-block">
        <div class="ai-block-header">AI Response</div>
        <div class="ai-block-section">
          <h4>Answer</h4>
          <p class="ai-text">${NexusAI.escapeHtml("I've analyzed your request and outlined next steps. Tell me which section to expand.")}</p>
        </div>
        <div class="ai-block-section">
          <h4>Context</h4>
          <p class="ai-text ai-text-sm">${NexusAI.escapeHtml(excerpt)}</p>
        </div>
        <div class="ai-block-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-action="copy">Copy</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="regenerate">Regenerate</button>
          <button type="button" class="btn btn-ghost btn-sm" data-action="edit">Edit</button>
          <button type="button" class="btn btn-primary btn-sm" data-action="continue">Continue</button>
        </div>
      </article>`;
  }

  function renderMessage(msg) {
    if (msg.role === 'user') {
      return `
        <div class="msg-user">
          <div class="msg-label">You</div>
          <div class="msg-body">${NexusAI.escapeHtml(msg.content)}</div>
        </div>`;
    }
    if (typeof msg.content === 'string' && msg.content.startsWith('intro:')) {
      const intro = msg.content.slice(6);
      return `<div class="ai-intro-line"><p class="ai-text">${NexusAI.escapeHtml(intro)}</p></div>`;
    }
    if (typeof msg.content === 'string' && msg.content.startsWith('mock:')) {
      return mockBlockHtml(msg.content);
    }
    if (msg.content === 'structured-travel') return mockBlockHtml('mock:travel-japan');
    return genericAiResponse(msg.content || '');
  }

  function syncModelSelector() {
    const select = document.getElementById('model-select');
    const chats = NexusAI.getChats();
    const chat = chats[activeChatId];
    if (select && chat?.model) {
      select.value = chat.model;
    }
  }

  function getChatListItems() {
    const chats = NexusAI.getChats();
    return Object.values(chats)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 8)
      .map((c) => ({ id: c.id, title: c.title }));
  }

  function renderThread() {
    const thread = document.getElementById('chat-thread');
    const chats = NexusAI.getChats();
    const chat = chats[activeChatId];
    const titleEl = document.getElementById('chat-title');
    if (!thread) return;
    if (!chat) {
      if (titleEl) titleEl.textContent = 'New conversation';
      thread.innerHTML = '<p class="text-muted" style="font-size:0.875rem;">Start typing below to begin.</p>';
      syncModelSelector();
      return;
    }
    if (titleEl) titleEl.textContent = chat.title;
    thread.innerHTML = chat.messages.length
      ? chat.messages.map(renderMessage).join('')
      : '<p class="text-muted" style="font-size:0.875rem;">Start typing below to begin.</p>';
    bindResponseActions(thread);
    thread.scrollTop = thread.scrollHeight;
    syncModelSelector();
  }

  function bindResponseActions(container) {
    container.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const block = btn.closest('.ai-block');
        const text = block?.innerText || '';
        const chats = NexusAI.getChats();
        const chat = chats[activeChatId];
        if (action === 'copy') {
          navigator.clipboard.writeText(text).then(() => NexusAI.toast('Copied to clipboard'));
        } else if (action === 'regenerate' && chat) {
          const lastUser = [...chat.messages].reverse().find((m) => m.role === 'user');
          if (lastUser) {
            chat.messages.push({ role: 'assistant', content: pickMockForText(lastUser.content) });
            NexusAI.saveChats(chats);
            renderThread();
            NexusAI.toast('Response regenerated');
          }
        } else if (action === 'edit') {
          NexusAI.toast('Edit mode opened');
        } else if (action === 'continue') {
          const input = document.getElementById('chat-input');
          if (input) {
            input.value = 'Continue with more detail on the next section.';
            input.focus();
          }
        }
      });
    });
  }

  function pickMockForText(text) {
    const t = text.toLowerCase();
    if (/travel|japan|website|itinerary/.test(t)) return 'mock:travel-japan';
    if (/college|research|program/.test(t)) return 'mock:college-research';
    if (/portfolio|design/.test(t)) return 'mock:portfolio-design';
    if (/study|plan|learn/.test(t)) return 'mock:ai-study-plan';
    if (/marketing|gtm|strategy/.test(t)) return 'mock:marketing-strategy';
    if (/python|code|sort/.test(t)) return 'mock:python-examples';
    return text;
  }

  function workspaceIntro(text) {
    const t = text.toLowerCase();
    if (/travel|japan|website/.test(t)) {
      return "I'll help you structure a clean travel website for Japan. Here's the direction I recommend.";
    }
    return "I'll help you with that. Here's the direction I recommend.";
  }

  function closeChatHistoryDrawer() {
    document.getElementById('chat-sidebar')?.classList.remove('mobile-open');
    document.getElementById('chat-history-overlay')?.classList.remove('visible');
    document.getElementById('chat-history-toggle')?.setAttribute('aria-expanded', 'false');
  }

  function toggleChatHistoryDrawer() {
    const sidebar = document.getElementById('chat-sidebar');
    const overlay = document.getElementById('chat-history-overlay');
    const toggle = document.getElementById('chat-history-toggle');
    if (!sidebar || !overlay) return;
    const open = !sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open', open);
    overlay.classList.toggle('visible', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function renderChatList() {
    const list = document.getElementById('chat-list');
    if (!list) return;
    const items = getChatListItems();
    list.innerHTML = items
      .map(
        (c) =>
          `<li><button type="button" class="chat-list-item${c.id === activeChatId ? ' active' : ''}" data-chat-id="${c.id}">${NexusAI.escapeHtml(c.title)}</button></li>`
      )
      .join('');
    list.querySelectorAll('.chat-list-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeChatId = btn.dataset.chatId;
        NexusAI.setActiveProjectId(activeChatId);
        closeChatHistoryDrawer();
        renderChatList();
        renderThread();
      });
    });
  }

  function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input?.value.trim();
    if (!text) return;
    const chats = NexusAI.getChats();
    let chat = chats[activeChatId];
    if (!chat) {
      activeChatId = NexusAI.slugify(text) + '-' + Date.now().toString(36);
      chat = { id: activeChatId, title: text.slice(0, 40), model: 'nexus-pro', messages: [], updatedAt: Date.now() };
      chats[activeChatId] = chat;
      NexusAI.setActiveProjectId(activeChatId);
    }
    chat.messages.push({ role: 'user', content: text });
    chat.messages.push({ role: 'assistant', content: pickMockForText(text) });
    chat.updatedAt = Date.now();
    NexusAI.saveChats(chats);
    input.value = '';
    renderChatList();
    renderThread();
  }

  function newChat() {
    localStorage.removeItem(NexusAI.STORAGE_KEYS.templatePrompt);
    localStorage.removeItem(NexusAI.STORAGE_KEYS.templateTitle);
    localStorage.removeItem(NexusAI.STORAGE_KEYS.workspacePrompt);
    localStorage.removeItem(NexusAI.STORAGE_KEYS.pendingWorkspaceAi);
    NexusAI.setActiveProjectId(null);

    activeChatId = 'new-' + Date.now().toString(36);
    const chats = NexusAI.getChats();
    chats[activeChatId] = {
      id: activeChatId,
      title: 'New conversation',
      model: 'nexus-pro',
      messages: [],
      updatedAt: Date.now(),
    };
    NexusAI.saveChats(chats);
    NexusAI.setActiveProjectId(activeChatId);

    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    closeChatHistoryDrawer();
    renderChatList();
    renderThread();
    NexusAI.toast('New chat started');
  }

  function maybeCompleteWorkspaceAi() {
    const pendingId = localStorage.getItem(NexusAI.STORAGE_KEYS.pendingWorkspaceAi);
    if (!pendingId || pendingId !== activeChatId) return;

    const chats = NexusAI.getChats();
    const chat = chats[activeChatId];
    if (!chat || chat.messages.length !== 1 || chat.messages[0].role !== 'user') {
      localStorage.removeItem(NexusAI.STORAGE_KEYS.pendingWorkspaceAi);
      return;
    }

    const userText = chat.messages[0].content;
    const thread = document.getElementById('chat-thread');
    if (thread) {
      thread.innerHTML =
        renderMessage(chat.messages[0]) +
        '<p class="text-muted chat-thinking" style="font-size:0.875rem;">NexusAI is thinking…</p>';
    }

    window.setTimeout(() => {
      localStorage.removeItem(NexusAI.STORAGE_KEYS.pendingWorkspaceAi);
      chat.messages.push({ role: 'assistant', content: 'intro:' + workspaceIntro(userText) });
      chat.messages.push({ role: 'assistant', content: pickMockForText(userText) });
      chat.updatedAt = Date.now();
      NexusAI.saveChats(chats);
      renderThread();
    }, 700);
  }

  function initFromRoute() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fresh') === '1') {
      NexusAI.setActiveProjectId(null);
    }

    const templatePrompt = localStorage.getItem(NexusAI.STORAGE_KEYS.templatePrompt);
    const templateTitle = localStorage.getItem(NexusAI.STORAGE_KEYS.templateTitle);

    if (templatePrompt) {
      activeChatId = 'template-' + Date.now().toString(36);
      const chats = NexusAI.getChats();
      const title = templateTitle || 'Template workflow';
      chats[activeChatId] = {
        id: activeChatId,
        title,
        model: 'nexus-pro',
        messages: [],
        updatedAt: Date.now(),
      };
      NexusAI.saveChats(chats);
      NexusAI.setActiveProjectId(activeChatId);
      localStorage.removeItem(NexusAI.STORAGE_KEYS.templatePrompt);
      localStorage.removeItem(NexusAI.STORAGE_KEYS.templateTitle);
      const input = document.getElementById('chat-input');
      if (input) input.value = templatePrompt;
      return;
    }

    const projectId = NexusAI.getActiveProjectId();
    if (projectId) {
      const normalized = NexusAI.normalizeProjectId(projectId);
      const chats = NexusAI.getChats();
      if (chats[normalized]) {
        activeChatId = normalized;
        return;
      }
    }

    activeChatId = 'new-' + Date.now().toString(36);
    const chats = NexusAI.getChats();
    chats[activeChatId] = {
      id: activeChatId,
      title: 'New conversation',
      model: 'nexus-pro',
      messages: [],
      updatedAt: Date.now(),
    };
    NexusAI.saveChats(chats);
    NexusAI.setActiveProjectId(activeChatId);
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('chat');
    initFromRoute();
    renderChatList();
    renderThread();
    maybeCompleteWorkspaceAi();

    document.getElementById('new-chat')?.addEventListener('click', newChat);
    document.getElementById('chat-send')?.addEventListener('click', sendMessage);
    document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    document.getElementById('clear-chat')?.addEventListener('click', () => {
      const chats = NexusAI.getChats();
      if (chats[activeChatId]) {
        chats[activeChatId].messages = [];
        NexusAI.saveChats(chats);
        renderThread();
        NexusAI.toast('Chat cleared');
      }
    });

    document.getElementById('btn-share')?.addEventListener('click', () => {
      NexusAI.toast('Share link copied');
    });

    document.getElementById('model-select')?.addEventListener('change', (e) => {
      const chats = NexusAI.getChats();
      if (chats[activeChatId]) {
        chats[activeChatId].model = e.target.value;
        NexusAI.saveChats(chats);
      }
      const label = e.target.selectedOptions[0]?.textContent || e.target.value;
      NexusAI.toast(`Model: ${label}`);
    });

    document.getElementById('chat-history-toggle')?.addEventListener('click', toggleChatHistoryDrawer);
    document.getElementById('chat-history-overlay')?.addEventListener('click', closeChatHistoryDrawer);

    document.querySelectorAll('.chat-composer .tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => NexusAI.toast(`${btn.dataset.label} ready`));
    });
  });
})();
