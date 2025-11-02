// js/poll.js — Sondage localStorage (anti double vote local)
(function(){
  const POLL_KEY = 'csc:poll:demo'; // change l'id si tu fais plusieurs sondages

  function getState(){
    try{ return JSON.parse(localStorage.getItem(POLL_KEY) || '{"voted":false,"counts":{}}'); }
    catch { return { voted:false, counts:{} }; }
  }
  function setState(s){ localStorage.setItem(POLL_KEY, JSON.stringify(s)); }

  function render(){
    const ctn = document.querySelector('[data-poll]');
    if(!ctn) return;
    const s = getState();
    const options = Array.from(ctn.querySelectorAll('[data-option]')).map(el => el.getAttribute('data-option'));
    const total = options.reduce((acc,k)=>acc+(s.counts[k]||0),0);
    ctn.querySelectorAll('[data-count]').forEach(span=>{
      const key = span.getAttribute('data-count');
      const n = s.counts[key] || 0;
      const pct = total? Math.round(n*100/total):0;
      span.textContent = `${n} (${pct}%)`;
    });
    const votedMsg = ctn.querySelector('[data-voted]');
    if (votedMsg) votedMsg.hidden = !s.voted;
  }

  function onVote(key){
    const s = getState();
    if(s.voted) return alert('Tu as déjà voté (local).');
    s.voted = true;
    s.counts[key] = (s.counts[key]||0)+1;
    setState(s);
    render();
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('[data-option]').forEach(btn=>{
      btn.addEventListener('click', ()=> onVote(btn.getAttribute('data-option')));
    });
    render();
  });
})();
