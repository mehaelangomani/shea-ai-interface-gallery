(() => {
  const groups=[...document.querySelectorAll('.nav-group')];
  const closeGroups=(except)=>groups.forEach(g=>{if(g!==except)g.classList.remove('open')});
  groups.forEach(g=>{
    const b=g.querySelector('.nav-button'); if(!b)return;
    b.addEventListener('click',e=>{e.preventDefault();const open=g.classList.contains('open');closeGroups();if(!open)g.classList.add('open')});
    g.addEventListener('mouseleave',()=>g.classList.remove('open'));
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeGroups()});
  const toggle=document.querySelector('.mobile-toggle'),menu=document.querySelector('.mobile-menu');
  if(toggle&&menu)toggle.addEventListener('click',()=>{const active=toggle.classList.toggle('active');menu.classList.toggle('active',active);toggle.setAttribute('aria-expanded',String(active))});
  const form=document.querySelector('[data-auth-form]');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();const email=form.querySelector('input[type="email"]')?.value;if(email)localStorage.setItem('quizpathUser',email);location.href=form.dataset.redirect||'generate.html'});
  document.querySelectorAll('[data-plan]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem('quizpathPlan',btn.dataset.plan);location.href='payment.html'}));
  const payment=document.querySelector('[data-payment-form]');
  if(payment)payment.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('quizpathPaid','true');location.href='generate.html'});
  document.querySelectorAll('[data-demo]').forEach(el=>el.addEventListener('click',()=>{const t=document.getElementById('toast');if(t){t.textContent=el.dataset.demo||'Done';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}}));
})();
/* Cursor-reactive glass: one delegated pointer listener for every card/panel. */
(() => {
  const cards = document.querySelectorAll(
    '.card[data-reactive-card], .stat[data-reactive-card], .panel[data-reactive-card], .question-card[data-reactive-card], .auth-card[data-reactive-card]'
  );

  cards.forEach(card => {
    let raf = 0;
    let x = 50;
    let y = 50;

    const update = () => {
      raf = 0;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      const dx = x - 50;
      const dy = y - 50;
      const intensity = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 70);
      card.style.setProperty('--glass-glow', intensity.toFixed(3));
      card.style.setProperty('--glass-angle', `${135 + dx * .12}deg`);
    };

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });

    card.addEventListener('pointerenter', event => {
      const rect = card.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glass-glow', '1');
      update();
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.setProperty('--glass-glow', '0');
      card.style.setProperty('--glass-angle', '135deg');
    }, { passive: true });
  });
})();
