cat > js/blog.js <<'JS'
// js/blog.js — Blog statique (fetch JSON + filtres + favoris)
(async function () {
  const $list   = document.querySelector('[data-list]');
  const $cats   = document.querySelector('[data-cats]');
  const $count  = document.querySelector('[data-count]');
  const $search = document.querySelector('[data-search]');
  const $savedToggle = document.querySelector('[data-saved-toggle]');

  const SAVED_KEY = 'csc_blog_saved_v1';
  let saved = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'));
  const persistSaved = () => localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));

  let data;
  try {
    const res = await fetch('./data/blog.json', { cache: 'no-store' });
    data = await res.json();
  } catch (err) {
    console.error('Erreur JSON blog:', err);
    $list.innerHTML = '<div class="card">⚠️ Impossible de charger <code>data/blog.json</code>. Vérifie le fichier, puis rafraîchis.</div>';
    return;
  }

  const categories = data.categories || [];
  const posts = (data.posts || []).slice().sort((a,b)=> (b.date||'').localeCompare(a.date||''));

  const qs = new URLSearchParams(location.search);
  let state = {
    category: qs.get('cat') || 'all',
    q: '',
    showSaved: false,
  };

  function renderCats() {
    const html = ['all', ...categories.map(c => c.id)].map(id => {
      const c = id === 'all' ? { id:'all', name:'Tous', emoji:'🗂️' } : categories.find(x => x.id === id);
      const active = state.category === id ? 'is-active' : '';
      const n = id === 'all' ? posts.length : posts.filter(p => p.category === id).length;
      return `<button class="pill ${active}" data-cat="${id}">${c.emoji ? c.emoji + ' ' : ''}${c.name} <span class="badge">${n}</span></button>`;
    }).join('');
    $cats.innerHTML = html;
  }

  function render() {
    let rows = posts.slice();
    if (state.category !== 'all') rows = rows.filter(p => p.category === state.category);
    if (state.q) {
      const q = state.q.toLowerCase();
      rows = rows.filter(p => (p.title + ' ' + p.excerpt).toLowerCase().includes(q));
    }
    if (state.showSaved) rows = rows.filter(p => saved.has(p.slug));

    $count.textContent = String(rows.length);
    if (!rows.length) {
      $list.innerHTML = '<div class="card">Aucun article pour ces filtres.</div>';
      return;
    }

    $list.innerHTML = rows.map(p => `
      <article class="card csc-reveal">
        ${p.cover ? `<img class="cover" src="${p.cover}" alt="">` : ''}
        <div class="card-body">
          <div class="small meta">
            ${(categories.find(c=>c.id===p.category)?.emoji || '🗂️')}
            ${(categories.find(c=>c.id===p.category)?.name || '')}
            • ${new Date(p.date).toLocaleDateString('fr-FR')}
            • par ${p.author || 'CSC'}
          </div>
          <h3 style="margin:.3rem 0">${p.title}</h3>
          <p class="meta">${p.excerpt}</p>
          <div class="row">
            <a class="button outline" href="#${p.slug}" data-read="${p.slug}">Lire</a>
            <button class="button ${saved.has(p.slug) ? 'is-saved':''}" data-save="${p.slug}">
              ${saved.has(p.slug) ? '★ Sauvé' : '☆ Sauver'}
            </button>
            <button class="button ghost" data-copy="${p.slug}">Copier le lien</button>
          </div>
          <div class="post-body" data-body="${p.slug}" style="display:none;margin-top:.6rem"></div>
        </div>
      </article>
    `).join('');
  }

  // Interactions
  $cats.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    state.category = btn.dataset.cat;
    renderCats(); render();
    const params = new URLSearchParams(location.search);
    if (state.category === 'all') params.delete('cat'); else params.set('cat', state.category);
    history.replaceState(null, '', '?' + params.toString());
  });

  $search.addEventListener('input', (e)=>{ state.q = e.target.value.trim(); render(); });

  $savedToggle.addEventListener('click', ()=>{
    state.showSaved = !state.showSaved;
    $savedToggle.classList.toggle('is-active', state.showSaved);
    render();
  });

  document.addEventListener('click', (e)=>{
    const saveBtn = e.target.closest('[data-save]');
    const readBtn = e.target.closest('[data-read]');
    const copyBtn = e.target.closest('[data-copy]');
    if (saveBtn) {
      const slug = saveBtn.dataset.save;
      if (saved.has(slug)) saved.delete(slug); else saved.add(slug);
      persistSaved(); render();
    }
    if (readBtn) {
      e.preventDefault();
      const slug = readBtn.dataset.read;
      const el = document.querySelector(`[data-body="${slug}"]`);
      const post = posts.find(p=>p.slug===slug);
      if (el && post) {
        el.innerHTML = post.body;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
      }
    }
    if (copyBtn) {
      const slug = copyBtn.dataset.copy;
      const cat = posts.find(p=>p.slug===slug)?.category || 'all';
      const url = location.origin + location.pathname + '?cat=' + encodeURIComponent(cat) + '#' + slug;
      navigator.clipboard.writeText(url).then(()=>{
        copyBtn.classList.add('pulse'); setTimeout(()=>copyBtn.classList.remove('pulse'), 160);
      });
    }
  });

  renderCats();
  render();
})();
JS

