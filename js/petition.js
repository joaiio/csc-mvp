// js/petition.js — compteur local + anti double signature (navigateur)
(function(){
  const SLUG = 'rsa-digne';
  const COUNT_KEY = `csc:petition:${SLUG}:count`;
  const SIGNED_KEY = `csc:petition:${SLUG}:signed`;

  function getCount(){ return parseInt(localStorage.getItem(COUNT_KEY)||'0',10); }
  function setCount(n){ localStorage.setItem(COUNT_KEY, String(n)); }
  function isSigned(){ return localStorage.getItem(SIGNED_KEY)==='1'; }
  function setSigned(){ localStorage.setItem(SIGNED_KEY,'1'); }

  function render(){
    const el = document.querySelector('[data-petition-count]');
    if (el) el.textContent = getCount();
    const btn = document.querySelector('[data-petition-sign]');
    if (btn) btn.disabled = isSigned();
  }

  function sign(){
    if (isSigned()) return;
    setCount(getCount()+1);
    setSigned();
    render();
    alert('Merci pour ton soutien (enregistré localement) ✔️');
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.querySelector('[data-petition-sign]');
    if(btn) btn.addEventListener('click', sign);
    render();
  });
})();
