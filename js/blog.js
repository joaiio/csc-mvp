(function(){
  const Q = new URLSearchParams(location.search);
  const slug = Q.get('p');

  const els = {
    listRoot: document.querySelector('[data-blog-list]'),
    postRoot: document.querySelector('[data-blog-post]'),
    catNav:   document.querySelector('[data-blog-cats]'),
    search:   document.getElementById('blog-search'),
    count:    document.querySelector('[data-blog-count]'),
    savedBtn: document.querySelector('[data-blog-show-saved]')
  };

  let data = { categories: [], posts: [] };
  let activeCat = 'all';
  let q = '';
  let saved = loadSaved();

  fetch('./data/blog.json')
    .then(r => r.json())
    .then(json => {
      data = json;
      if (slug) {
        renderPost(slug);
      } else {
        renderCats();
        bindUI();
        renderList();
      }
    });

  function bindUI(){
    if (els.search){
      els.search.addEventListener('input', (e)=>{ q = e.target.value.trim().toLowerCase(); renderList(); });
    }
    if (els.savedBtn){
      els.savedBtn.addEventListener('click', ()=>{
        els.savedBtn.classList.toggle('is-active');
        renderList();
      });
    }
    if (els.catNav){
      els.catNav.addEventListener('click', (e)=>{
        const id = e.target?.dataset?.cat;
        if(!id) return;
        activeCat = id;
        [...els.catNav.querySelectorAll('[data-cat]')].forEach(a=>a.classList.toggle('is-active', a.dataset.cat===id));
        renderList();
      });
    }
  }

  function renderCats(){
    if (!els.catNav) return;
    const total = data.posts.length;
    const items = data.categories.map(c => {
      const count = data.posts.filter(p=>p.category===c.id).length;
      return `<button class="pill" data-cat="${c.id}" aria-pressed="${activeCat===c.id}">${c.emoji} ${c.name}<span class="badge">${count}</span></button>`;
    }).join('');
    els.catNav.innerHTML = `
      <button class="pill is-active" data-cat="all" aria-pressed="true">🌐 Tout<span class="badge">${total}</span></button>
      ${items}
    `;
  }

  function renderList(){
    if (!els.listRoot) return;
    const onlySaved = els.savedBtn?.classList.contains('is-active');

    let list = data.posts.slice().sort((a,b)=> (a.date<b.date?1:-1));

    if (activeCat !== 'all') list = list.filter(p=>p.category===activeCat);
    if (q) list = list.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
      (p.tags||[]).some(t => t.toLowerCase().includes(q))
    );
    if (onlySaved) list = list.filter(p => saved.has(p.slug));

    els.count && (els.count.textContent = String(list.length));

    els.listRoot.innerHTML = list.map(p => card(p)).join('') || `
      <div class="card"><p class="meta">Aucun résultat…</p></div>
    `;
    els.listRoot.addEventListener('click', onCardClick);
  }

  function onCardClick(e){
    const slug = e.target?.dataset?.open;
    if (slug){
      location.href = `./blog.html?p=${encodeURIComponent(slug)}`;
      return;
    }
    const save = e.target?.dataset?.save;
    if (save){
      toggleSaved(save);
      const btn = e.target;
      btn.classList.toggle('is-saved', saved.has(save));
      btn.textContent = saved.has(save) ? '⭐ Enregistré' : '☆ Enregistrer';
    }
  }

  function card(p){
    const isSaved = saved.has(p.slug);
    return `
      <article class="card csc-reveal">
        ${p.cover ? `<img class="cover" src="${p.cover}" alt="" loading="lazy"/>` : ''}
        <div class="card-body">
          <div class="small">${fmtDate(p.date)} • ${catName(p.category)}</div>
          <h3>${p.title}</h3>
          <p class="meta">${p.excerpt||''}</p>
          <div class="row">
            <button class="button" data-open="${p.slug}">Lire</button>
            <button class="button outline ${isSaved?'is-saved':''}" data-save="${p.slug}">${isSaved?'⭐ Enregistré':'☆ Enregistrer'}</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderPost(slug){
    const p = data.posts.find(x=>x.slug===slug);
    if (!p){ location.href='./blog.html'; return; }
    if (!els.postRoot) return;

    els.postRoot.innerHTML = `
      <article class="card">
        ${p.cover ? `<img class="cover" src="${p.cover}" alt="" loading="lazy"/>` : ''}
        <div class="card-body">
          <div class="small">${fmtDate(p.date)} • ${catName(p.category)} • par ${p.author||'CSC'}</div>
          <h1>${p.title}</h1>
          <div class="prose">${p.body||''}</div>
          <div class="row">
            <a class="button" href="./blog.html">← Retour au blog</a>
            <button class="button outline" data-share>Copier le lien</button>
          </div>
        </div>
      </article>
    `;

    els.postRoot.addEventListener('click', async (e)=>{
      if (e.target?.dataset?.share!=null){
        await navigator.clipboard.writeText(location.href);
        e.target.classList.add('pulse');
        setTimeout(()=>e.target.classList.remove('pulse'),600);
      }
    });
  }

  function fmtDate(s){
    try{ return new Date(s).toLocaleDateString('fr-FR', {year:'numeric', month:'short', day:'2-digit'}); }
    catch(e){ return s; }
  }
  function catName(id){
    return (data.categories.find(c=>c.id===id)||{}).name || '—';
  }
  function loadSaved(){
    try{
      return new Set(JSON.parse(localStorage.getItem('csc_blog_saved_v1')||'[]'));
    }catch(_){ return new Set(); }
  }
  function persistSaved(){
    localStorage.setItem('csc_blog_saved_v1', JSON.stringify([...saved]));
  }
  function toggleSaved(slug){
    if (saved.has(slug)) saved.delete(slug);
    else saved.add(slug);
    persistSaved();
  }
})();
