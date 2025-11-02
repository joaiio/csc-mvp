// js/export.js — Export/Import localStorage (Agora/actions)
(function(){
  const EXPORT_KEYS = ['csc:user','csc:posts','csc:actions']; // adapte si besoin

  function download(filename, data){
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function doExport(){
    const dump = {};
    EXPORT_KEYS.forEach(k => dump[k] = localStorage.getItem(k));
    download('csc-export.json', JSON.stringify(dump, null, 2));
  }

  function doImport(file){
    const r = new FileReader();
    r.onload = () => {
      try{
        const dump = JSON.parse(String(r.result||'{}'));
        Object.entries(dump).forEach(([k,v]) => { if (typeof v === 'string') localStorage.setItem(k, v); });
        alert('Import terminé (rafraîchis la page)');
      }catch(e){ alert('Fichier invalide'); }
    };
    r.readAsText(file);
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const ex = document.querySelector('[data-export]');
    const im = document.querySelector('[data-import]');
    const inp = document.querySelector('input[type="file"][data-import-file]');
    if (ex) ex.addEventListener('click', doExport);
    if (im && inp) im.addEventListener('click', ()=> inp.click());
    if (inp) inp.addEventListener('change', ()=> inp.files?.[0] && doImport(inp.files[0]));
  });
})();
