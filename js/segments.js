
fetch('./data/segments.json').then(r=>r.json()).then(list=>{
  const el = document.getElementById('segments');
  el.innerHTML = list.map(s => `
   <section class="card">
     <span class="badge">${s.name}</span>
     <h3>${s.pedago[0]}</h3>
     <ul class="small">
       ${s.pedago.slice(1).map(x=>`<li>${x}</li>`).join('')}
     </ul>
     <p><b>Engagement :</b> ${s.engagement.join(' · ')}</p>
     <div style="display:flex;gap:.6rem;flex-wrap:wrap">
       <a class="button primary" href="${s.cta.href}">${s.cta.label}</a>
       ${s.routes.map(r=>`<a class="button ghost" href="${r}">${r.replace('./','/')}</a>`).join('')}
     </div>
   </section>
  `).join('');
});
