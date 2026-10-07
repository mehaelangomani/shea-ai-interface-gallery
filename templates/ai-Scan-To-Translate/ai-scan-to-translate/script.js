(() => {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', e => { e.stopPropagation(); const open = !header.classList.contains('menu-open'); header.classList.toggle('menu-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
    window.addEventListener('resize', () => { if (innerWidth > 800 && header.classList.contains('menu-open')) { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded','false'); } });
    document.addEventListener('click', e => { if (header.classList.contains('menu-open') && !header.contains(e.target)) { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded','false'); } });
  }
  document.querySelectorAll('.background').forEach(v => v.play().catch(() => {}));

  const input = document.getElementById('imageInput'), zone = document.getElementById('dropZone'), choose = document.getElementById('chooseImage'), preview = document.getElementById('scanPreview'), status = document.getElementById('scanStatus');
  const handleImage = file => { if (!file || !file.type.startsWith('image/')) return; const url = URL.createObjectURL(file); preview.src = url; zone.classList.add('has-image'); if(status) status.textContent = 'Image ready. Choose Translate to preview a result.'; };
  if (input && zone) { choose.addEventListener('click', () => input.click()); input.addEventListener('change', () => handleImage(input.files[0])); zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor='#fff'; }); zone.addEventListener('dragleave', () => zone.style.borderColor=''); zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor=''; handleImage(e.dataTransfer.files[0]); }); zone.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') input.click(); }); const sample = document.getElementById('useSample'); if(sample) sample.addEventListener('click', () => { preview.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'; zone.classList.add('has-image'); status.textContent='Sample menu loaded.'; }); }
  const translateBtn=document.getElementById('translateBtn'), output=document.getElementById('translationOutput'), detected=document.getElementById('detectedLabel'); if(translateBtn){translateBtn.addEventListener('click',()=>{detected.textContent='Detected: French';output.textContent='I am vegetarian. Do you have a menu in English?';if(status)status.textContent='Translation preview generated.';});}
  const copy=document.getElementById('copyBtn'); if(copy) copy.addEventListener('click', async()=>{try{await navigator.clipboard.writeText(output.textContent);status.textContent='Translation copied.'}catch{status.textContent='Copy is unavailable in this browser.'}});
  const save=document.getElementById('saveScanBtn'); if(save) save.addEventListener('click',()=>{localStorage.setItem('lastScan', output.textContent);status.textContent='Saved.'});
  const swap=document.getElementById('swapLanguages'); if(swap) swap.addEventListener('click',()=>{const els=document.querySelectorAll('.language-select'); if(els.length>1){const a=els[0].value,b=els[1].value;els[0].value=b;els[1].value=a;status.textContent='Languages swapped.';}});

  const phraseSearch=document.getElementById('phraseSearch'), phraseList=document.getElementById('phraseList'); if(phraseSearch&&phraseList){phraseList.querySelectorAll('.phrase-item').forEach(x=>x.hidden=false);phraseSearch.addEventListener('input',()=>{const q=phraseSearch.value.toLowerCase();phraseList.querySelectorAll('.phrase-item').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(q));});document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;phraseList.querySelectorAll('.phrase-item').forEach(x=>x.hidden=f!=='all'&&x.dataset.category!==f);}));document.querySelectorAll('.play-phrase').forEach(btn=>btn.addEventListener('click',()=>{const text=btn.dataset.phrase;if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(text);speechSynthesis.cancel();speechSynthesis.speak(u);}document.getElementById('phraseStatus').textContent='Playing phrase: '+text;}));const add=document.getElementById('addPhrase');const addInline=document.getElementById('phraseAddInline');const newPhraseInput=document.getElementById('newPhraseInput');const savePhrase=document.getElementById('savePhrase');const cancelPhrase=document.getElementById('cancelPhrase');const openAddPhrase=()=>{if(!addInline)return;addInline.hidden=false;newPhraseInput.value='';newPhraseInput.focus();};const closeAddPhrase=()=>{if(!addInline)return;addInline.hidden=true;newPhraseInput.value='';};const saveNewPhrase=()=>{const cleanText=(newPhraseInput?.value||'').trim();if(!cleanText){newPhraseInput?.focus();return;}const item=document.createElement('article');item.className='phrase-item saved-phrase';item.dataset.category='saved';item.innerHTML='<span class="phrase-category">PERSONAL · SAVED</span><strong></strong><span>Saved phrase</span><button class="play-phrase" data-phrase="" aria-label="Play phrase" type="button">▶</button>';item.querySelector('strong').textContent=cleanText;const play=item.querySelector('.play-phrase');play.dataset.phrase=cleanText;play.addEventListener('click',()=>{if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(cleanText);speechSynthesis.cancel();speechSynthesis.speak(u);}document.getElementById('phraseStatus').textContent='Playing phrase: '+cleanText;});phraseList.insertBefore(item,phraseList.firstElementChild);phraseList.querySelectorAll('.phrase-item').forEach(x=>{x.hidden=false;});const allFilter=document.querySelector('.filter[data-filter="all"]');if(allFilter){document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));allFilter.classList.add('active');}phraseSearch.value='';closeAddPhrase();};if(add)add.addEventListener('click',openAddPhrase);if(savePhrase)savePhrase.addEventListener('click',saveNewPhrase);if(cancelPhrase)cancelPhrase.addEventListener('click',closeAddPhrase);if(newPhraseInput)newPhraseInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();saveNewPhrase();}if(e.key==='Escape')closeAddPhrase();});}

  const send=document.getElementById('sendConversation'), convInput=document.getElementById('conversationInput'), stream=document.getElementById('conversationStream'), convStatus=document.getElementById('conversationStatus'); if(send&&convInput&&stream){const addBubble=(text,side,lang)=>{const b=document.createElement('div');b.className='bubble '+side;const s=document.createElement('span');s.textContent=lang;b.append(s,document.createTextNode(text));stream.appendChild(b);stream.scrollTop=stream.scrollHeight;};send.addEventListener('click',()=>{const text=convInput.value.trim();if(!text)return;addBubble(text,'left','ENGLISH');setTimeout(()=>addBubble('Translation preview: '+text,'right','SPANISH'),300);convInput.value='';if(convStatus)convStatus.textContent='Conversation turn added.';});convInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();send.click();}});const speak=document.getElementById('speakConversation');if(speak)speak.addEventListener('click',()=>{if('SpeechRecognition'in window||'webkitSpeechRecognition'in window){const R=window.SpeechRecognition||window.webkitSpeechRecognition;const r=new R();r.lang='en-US';r.onresult=e=>{convInput.value=e.results[0][0].transcript;send.click();};r.start();if(convStatus)convStatus.textContent='Listening…';}else if(convStatus)convStatus.textContent='Voice input is not supported in this browser.';});const swapConv=document.getElementById('convSwap');if(swapConv)swapConv.addEventListener('click',()=>{const a=document.getElementById('convSource'),b=document.getElementById('convTarget'),t=a.textContent;a.textContent=b.textContent;b.textContent=t;});}

  const profileInput=document.getElementById('profileInput'), profileImage=document.getElementById('profileImage'); if(profileInput&&profileImage)profileInput.addEventListener('change',()=>{const file=profileInput.files[0];if(file){profileImage.src=URL.createObjectURL(file);localStorage.setItem('profilePhoto',profileImage.src)}}); if(profileImage&&localStorage.getItem('profilePhoto'))profileImage.src=localStorage.getItem('profilePhoto');
  const detail=document.getElementById('settingsDetail'); document.querySelectorAll('.setting-row').forEach(row=>row.addEventListener('click',()=>{if(!detail)return;const type=row.dataset.setting;detail.hidden=false;if(type==='history')detail.innerHTML='<h3>Translation History</h3><div class="history-line"><span>French → English</span><span>Today · 10:32 PM</span></div><div class="history-line"><span>Japanese → English</span><span>Today · 8:14 PM</span></div><div class="history-line"><span>Spanish → English</span><span>Yesterday · 6:21 PM</span></div>';else if(type==='languages')detail.innerHTML='<h3>Default Languages</h3><p class="lead">Source: Auto detect · Target: English</p>';else if(type==='translation-style'){detail.innerHTML='<h3>Translation Style</h3><p class="lead">Choose how translated text should sound.</p><div class="history-line"><span>Natural</span><span>Conversational and fluent</span></div><div class="history-line"><span>Literal</span><span>Closer to the original wording</span></div><div class="history-line"><span>Formal</span><span>Polished and professional</span></div>';}else if(type==='notifications'){const v=document.getElementById('notificationValue');v.textContent=v.textContent==='On'?'Off':'On';detail.innerHTML='<p class="lead">Notification preference updated.</p>';}else if(type==='premium')location.href='pricing.html';})); const signout=document.getElementById('signOut');if(signout)signout.addEventListener('click',()=>{localStorage.removeItem('profilePhoto');location.href='signin.html';});

  const signForm=document.getElementById('signinForm');if(signForm){const st=document.getElementById('signinStatus');signForm.addEventListener('submit',e=>{e.preventDefault();const em=document.getElementById('signinEmail'),pw=document.getElementById('signinPassword');if(!em.value.trim()||!em.checkValidity()){st.textContent='Please enter a valid email address.';em.focus();return;}if(pw.value.length<4){st.textContent='Please enter your password.';pw.focus();return;}localStorage.setItem('llUser',em.value.trim());st.textContent='Signed in for this frontend preview.';setTimeout(()=>location.href='index.html',700);});const sp=document.getElementById('showPass');if(sp)sp.addEventListener('click',()=>{const pw=document.getElementById('signinPassword');const show=pw.type==='password';pw.type=show?'text':'password';sp.textContent=show?'Hide':'Show';});const fp=document.getElementById('forgotPass');if(fp)fp.addEventListener('click',()=>{st.textContent='A reset link would be emailed in the full version of LingoLens.';});}
  const change=document.getElementById('changeImage');if(change&&input)change.addEventListener('click',e=>{e.stopPropagation();input.value='';input.click();});
  const tabs=document.querySelectorAll('.app-tab');const showPanel=id=>{tabs.forEach(t=>t.classList.toggle('active',t.dataset.panel===id));document.querySelectorAll('.app-panel').forEach(p=>p.hidden=p.id!==id);};tabs.forEach(t=>t.addEventListener('click',()=>{showPanel(t.dataset.panel);history.replaceState(null,'',t.dataset.panel==='phrasebook'?'#phrasebook':location.pathname);}));if(tabs.length&&location.hash==='#phrasebook')showPanel('phrasebook');
/* =========================================
   LINGOLENS — CLEAN TYPEWRITER EFFECT
   ========================================= */

const typewriterTargets = document.querySelectorAll(
  '.home-content h1, ' +
  '.home-content .hero-copy, ' +
  '.page-content h1, ' +
  '.page-content .lead, ' +
  '.scan-heading h1, ' +
  '.conversation-top h1, ' +
  '.library-center h1, ' +
  '.settings-head h1, ' +
  '.pricing-head h1, ' +
  '.auth-content h1'
);

function prepareTypewriter(element) {
  if (element.dataset.typewriterReady === 'true') return;

  element.dataset.typewriterReady = 'true';

  /*
   * Walk through the existing HTML so <br> tags,
   * spacing and the original layout are preserved.
   */
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  const characters = [];

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();

    [...text].forEach(character => {
      const span = document.createElement('span');

      span.className = 'type-char';
      span.textContent = character;

      fragment.appendChild(span);
      characters.push(span);
    });

    textNode.parentNode.replaceChild(fragment, textNode);
  });

  if (!characters.length) return;

  /*
   * Small cursor.
   * It is added after the existing content,
   * so it never changes the heading's layout.
   */
  const caret = document.createElement('span');

  caret.className = 'type-caret';

  element.appendChild(caret);

  element._typewriterCharacters = characters;
  element._typewriterCaret = caret;
}

function runTypewriter(element) {
  if (element.dataset.typewriterStarted === 'true') return;

  element.dataset.typewriterStarted = 'true';

  const characters = element._typewriterCharacters;
  const caret = element._typewriterCaret;

  if (!characters || !characters.length) return;

  let index = 0;

  caret.classList.add('is-active');

  function typeCharacter() {
    if (index >= characters.length) {
      caret.classList.add('is-active');
      return;
    }

    const character = characters[index];

    character.classList.add('is-typed');

    /*
     * Move the cursor beside the currently typed
     * character without changing the heading layout.
     */
    character.after(caret);

    index++;

    /*
     * Slightly faster for spaces,
     * normal speed for letters.
     */
    const delay =
      character.textContent === ' '
        ? 25
        : 38;

    setTimeout(typeCharacter, delay);
  }

  typeCharacter();
}


/* Prepare the text without changing its layout */
typewriterTargets.forEach(prepareTypewriter);


/* Start typing when text enters the screen */
if ('IntersectionObserver' in window) {

  const typewriterObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        runTypewriter(entry.target);

        typewriterObserver.unobserve(entry.target);

      });

    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  typewriterTargets.forEach(element => {
    typewriterObserver.observe(element);
  });

} else {

  /* Fallback for older browsers */
  typewriterTargets.forEach(runTypewriter);

}
})();
