(function () {
  'use strict';

  const STATUS_STEPS = ['understanding', 'research', 'plan', 'generate'];
  const STATUS_LABELS = {
    understanding: 'Understanding',
    research: 'Research',
    plan: 'Plan',
    generate: 'Generate',
  };

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function renderStatusPipeline(status) {
    const idx = STATUS_STEPS.indexOf(status);
    return STATUS_STEPS
      .map((step, i) => {
        let cls = 'status-step';
        if (i < idx) cls += ' done';
        else if (i === idx) cls += ' active';
        return `<span class="${cls}">${STATUS_LABELS[step]}</span>`;
      })
      .join('');
  }

  function renderActiveProjects() {
    const container = document.getElementById('active-projects-list');
    if (!container) return;
    const projects = NexusAI.getProjects().slice(0, 4);
    container.innerHTML = projects
      .map(
        (p) => `
      <article class="project-mini" data-project-id="${p.id}">
        <h4>${NexusAI.escapeHtml(p.title)}</h4>
        <div class="status-pipeline">${renderStatusPipeline(p.status || 'understanding')}</div>
      </article>`
      )
      .join('');
    container.querySelectorAll('.project-mini').forEach((el) => {
      el.addEventListener('click', () => {
        NexusAI.setActiveProjectId(el.dataset.projectId);
        window.location.href = 'chat.html';
      });
    });
  }

  function createProjectFromPrompt(prompt) {
    const title = prompt.length > 42 ? prompt.slice(0, 42) + '…' : prompt;
    const id = NexusAI.slugify(prompt) + '-' + Date.now().toString(36);
    const project = {
      id,
      title,
      type: 'chat',
      updated: new Date().toISOString(),
      status: 'understanding',
    };
    NexusAI.addProject(project);
    const chats = NexusAI.getChats();
    chats[id] = {
      id,
      title,
      model: 'nexus-pro',
      messages: [{ role: 'user', content: prompt }],
    };
    NexusAI.saveChats(chats);
    NexusAI.setActiveProjectId(id);
    localStorage.setItem(NexusAI.STORAGE_KEYS.pendingWorkspaceAi, id);
    return project;
  }

  function sendPrompt() {
    const input = document.getElementById('workspace-prompt');
    const prompt = input?.value.trim();
    if (!prompt) {
      NexusAI.toast('Describe what you want to do first.', 'error');
      return;
    }
    createProjectFromPrompt(prompt);
    NexusAI.toast('Project started — opening chat…');
    setTimeout(() => {
      window.location.href = 'chat.html';
    }, 600);
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('workspace');
    const profile = NexusAI.getProfile();
    const greetEl = document.getElementById('user-greeting');
    if (greetEl) greetEl.textContent = `${greeting()}, ${profile.name}.`;

    document.querySelectorAll('.cap-card').forEach((card) => {
      card.addEventListener('click', () => {
        const target = card.dataset.href;
        if (target) window.location.href = target;
      });
    });

    document.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('workspace-prompt');
        if (input) input.value = chip.dataset.prompt || chip.textContent;
        input?.focus();
      });
    });

    document.getElementById('workspace-send')?.addEventListener('click', sendPrompt);
    document.getElementById('workspace-prompt')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendPrompt();
      }
    });

    document.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        NexusAI.toast(`${btn.dataset.label || 'Tool'} ready`);
      });
    });

    renderActiveProjects();
  });
})();
