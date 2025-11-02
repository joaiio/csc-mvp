
fetch('./data/contents.json').then(r=>r.json()).then(list=>{
  const el = document.getElementById('kit');
  el.innerHTML = list.map(c => `
  <article class="card" id="${c.id}">
    <span class="badge">${c.type}</span>
    <h3>${c.title}</h3>
    <p class="small meta">${c.platforms.join(' · ')} — ${c.audience.join(', ')}</p>
    <pre style="white-space:pre-wrap;background:rgba(255,255,255,.04);padding:12px;border-radius:12px">${c.copy}</pre>
    <div style="display:flex;gap:.6rem">
      <button class="button primary" onclick="copyText('${c.id}')">Copier le texte</button>
      ${c.cta ? `<a class="button ghost" href="${c.cta}">Aller à l’action</a>` : ''}
    </div>
  </article>
  `).join('');
  window.copyText = async (id) => {
    const c = list.find(x=>x.id===id); if(!c) return;
    try{ await navigator.clipboard.writeText(c.copy); alert('Copié !'); }
    catch(e){ console.error(e); }
  };
});
