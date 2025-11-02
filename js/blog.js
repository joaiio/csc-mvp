// js/blog.js — Blog statique (JSON)
(async function(){
  const TABS = document.getElementById('tabs');
  const GRID = document.getElementById('grid');
  const Q = document.getElementById('q');
  const DLG = document.getElementById('dlg');
  const DLG_BODY = document.getElementById('dlgBody');
  const DLG_CLOSE = document.getElementById('dlgClose');
  const DLG_COPY = document.getElementById('dlgCopyLink');

  const res = await fetch('./data/blog.json');
  const data = await res.json();
  const categories = [{id:'all', name:'Tous', emoji:'✨'}].concat(data.categories);
  let state = { cat:'all', q:'' };

  // Onglets
  function renderTabs(){
    TABS.innerHTML = categories.map(c => `
      <button class="pill ${state.cat===c.id?'active':''}" data-cat="${c.id}">
        <span>${c.emoji||''}</span> ${c.name}
      </button>
    `).join('');
    TABS.querySelectorAll('.pill').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        state.cat = btn.dataset.cat;
        renderTabs(); // met à jour l'état actif visuel
        renderGrid();
      });
    });
  }

  // Cartes
  function renderGrid(){
    let posts = data.posts.slice().sort((a,b)=> (a.date<b.date?1:-1));
    if(state.cat!=='all') posts = posts.filter(p=>p.category===state.cat);
    if(state.q){
      const q = state.q.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt||'').toLowerCase().includes(q) ||
        (p.tags||[]).join(' ').toLowerCase().includes(q)
      );
    }
    GRID.innerHTML = posts.map(p=> card(p)).join('') || `<div class="card">Aucun résultat.</div>`;
    GRID.querySelectorAll('[data-open]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        openPost(a.getAttribute('data-open'));
      });
    });
  }

  function card(p){
    const cover = p.cover || './assets/logo-hero.png';
    return `
      <article class="card csc-reveal">
        <img class="cover" src="${cover}" alt="" onerror="this.style.display='none'"/>
        <div class="card-body">
          <div class="small meta">${formatDate(p.date)} — ${escapeHtml(p.author||'CSC')}</div>
          <h3 style="margin:.2rem 0 .3rem">${escapeHtml(p.title)}</h3>
          <p class="meta">${escapeHtml(p.excerpt||'')}</p>
          <div class="row">
            <a href="./blog.html#${p.slug}" class="button ghost" data-open="${p.slug}">Lire</a>
            <button class="button outline" data-copy="${p.slug}">Copier le lien</button>
            ${pillCat(p.category)}
          </div>
        </div>
      </article>
    `;
  }

  function pillCat(cat){
    const c = categories.find(x=>x.id===cat);
    if(!c) return '';
    return `<span class="pill"><span>${c.emoji||''}</span> ${c.name}</span>`;
  }

  function openPost(slug){
    const p = data.posts.find(x=>x.slug===slug);
    if(!p) return;
    DLG_BODY.innerHTML = `
      <div class="small meta">${formatDate(p.date)} — ${escapeHtml(p.author||'CSC')}</div>
      <h3 style="margin:.2rem 0 .6rem">${escapeHtml(p.title)}</h3>
      ${p.cover?`<img class="cover" src="${p.cover}" alt="" onerror="this.style.display='none'"/>`:''}
      <div style="margin-top:.6rem">${p.body||''}</div>
    `;
    DLG_COPY.onclick = ()=>{
      const url = `${location.origin}${location.pathname.replace(/[^/]+$/,'')}blog.html#${slug}`;
      navigator.clipboard.writeText(url);
      DLG_COPY.classList.add('pulse');
      setTimeout(()=>DLG_COPY.classList.remove('pulse'),180);
    };
    if(typeof DLG.showModal==='function'){ DLG.showModal(); } else { DLG.open=true; }
    location.hash = slug;
  }

  // Recherche
  Q.addEventListener('input', ()=>{
    state.q = Q.value.trim();
    renderGrid();
  });

  DLG_CLOSE.addEventListener('click', ()=>{
    if(typeof DLG.close==='function'){ DLG.close(); } else { DLG.open=false; }
    history.replaceState(null, '', location.pathname); // enlève le hash
  });

  // Helpers
  function formatDate(s){
    try{ return new Date(s).toLocaleDateString('fr-FR', {year:'numeric',month:'short',day:'2-digit'}); }
    catch{ return s; }
  }
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }

  // Init
  renderTabs();
  renderGrid();

  // Ouvre auto si hash
  if(location.hash){
    const slug = location.hash.slice(1);
    const exists = data.posts.some(p=>p.slug===slug);
    if(exists) openPost(slug);
  }
})();

