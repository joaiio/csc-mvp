// js/profile.js — Profil local (pseudo + avatar)
(function () {
  const KEY = 'csc:user';
  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function setUser(u) { localStorage.setItem(KEY, JSON.stringify(u)); }

  // Forme simple: <form id="csc-profile-form"><input name="name" /></form>
  function mountProfile() {
    const form = document.querySelector('#csc-profile-form');
    if (!form) return;
    const nameInput = form.querySelector('input[name="name"]');
    const user = getUser();
    if (user.name && nameInput) nameInput.value = user.name;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (nameInput?.value || '').trim();
      if (!name) return;
      setUser({ name });
      alert('Profil enregistré localement ✔️');
      try { document.querySelectorAll('[data-user-name]').forEach(n => n.textContent = name); } catch {}
    });
  }

  // Avatar (initiales) — place un <span class="csc-avatar" data-avatar></span>
  function mountAvatar() {
    const el = document.querySelector('[data-avatar]');
    if (!el) return;
    const { name = '' } = getUser();
    const initials = (name || 'Anonyme').split(/\s+/).map(p => p[0]?.toUpperCase() || '').join('').slice(0,2);
    el.textContent = initials || 'A';
  }

  window.addEventListener('DOMContentLoaded', () => {
    mountProfile();
    mountAvatar();
  });
})();
