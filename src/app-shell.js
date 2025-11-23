import { Storage } from './utils/storage.js';

class AppDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      contacts: [],
      filter: { query: '', tags: [] },
      view: 'list'
    };
    this.storageKey = 'agenda_inteligente_contacts_v1';
    this.onAdd = this.onAdd.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onToggleFav = this.onToggleFav.bind(this);
  }

  connectedCallback() {
    this.load();
    this.render();
    this.shadowRoot.addEventListener('contact:add', this.onAdd);
    this.shadowRoot.addEventListener('contact:update', this.onUpdate);
    this.shadowRoot.addEventListener('contact:delete', this.onDelete);
    this.shadowRoot.addEventListener('filter:change', this.onFilter);
    this.shadowRoot.addEventListener('item:toggle-fav', this.onToggleFav);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('contact:add', this.onAdd);
    this.shadowRoot.removeEventListener('contact:update', this.onUpdate);
    this.shadowRoot.removeEventListener('contact:delete', this.onDelete);
    this.shadowRoot.removeEventListener('filter:change', this.onFilter);
    this.shadowRoot.removeEventListener('item:toggle-fav', this.onToggleFav);
  }

  // Carga desde localStorage
  load() {
    const saved = Storage.get(this.storageKey);
    if (saved && Array.isArray(saved)) {
      this.state.contacts = saved;
    } else {
      this.state.contacts = [];
    }
  }

  // Guardar estado en localStorage
  save() {
    Storage.set(this.storageKey, this.state.contacts);
    this.updateChildrenProps();
  }

  get contacts() { return this.state.contacts; }
  set contacts(v) { this.state.contacts = Array.isArray(v) ? v : []; this.save(); }

  // Actualiza props en hijos conocidos
  updateChildrenProps() {
    const list = this.shadowRoot.querySelector('contact-list');
    if (list) list.contacts = this.getFilteredContacts();
    const stats = this.shadowRoot.querySelector('stats-card');
    if (stats) stats.contacts = this.state.contacts;
  }

  getFilteredContacts() {
    const q = (this.state.filter.query || '').toLowerCase();
    const tags = this.state.filter.tags || [];
    return this.state.contacts.filter(c => {
      const matchQuery = !q || (c.nombre && c.nombre.toLowerCase().includes(q)) || (c.email && c.email.toLowerCase().includes(q)) || (c.telefono && c.telefono.includes(q));
      const matchTags = !tags.length || tags.every(t => (c.tags||[]).includes(t));
      return matchQuery && matchTags;
    });
  }

  onAdd(e) {
    const contact = e.detail && e.detail.contact;
    if (!contact) return;
    contact.id = contact.id || 'id_' + Date.now();
    contact.creado = contact.creado || (new Date()).toISOString().slice(0,7);
    this.state.contacts.unshift(contact);
    this.save();
    this.renderToast('Contacto agregado');
  }

  onUpdate(e) {
    const contact = e.detail && e.detail.contact;
    if (!contact || !contact.id) return;
    const idx = this.state.contacts.findIndex(c => c.id === contact.id);
    if (idx > -1) {
      this.state.contacts[idx] = contact;
      this.save();
      this.renderToast('Contacto actualizado');
    }
  }

  onDelete(e) {
    const id = e.detail && e.detail.id;
    if (!id) return;
    this.state.contacts = this.state.contacts.filter(c => c.id !== id);
    this.save();
    this.renderToast('Contacto eliminado');
  }

  onFilter(e) {
    const f = e.detail || {};
    this.state.filter = Object.assign({}, this.state.filter, f);
    this.updateChildrenProps();
  }

  onToggleFav(e) {
    const id = e.detail && e.detail.id;
    const c = this.state.contacts.find(x => x.id === id);
    if (c) {
      c.favorito = !c.favorito;
      this.save();
      this.renderToast(c.favorito ? 'Marcado favorito' : 'Desmarcado favorito');
    }
  }

  renderToast(msg) {
    const toast = this.shadowRoot.querySelector('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { --accent:#0b74de; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial; display:block; max-width:980px; margin:16px auto; padding:12px; }
        .shell { display:grid; grid-template-columns: 1fr 320px; gap:16px; align-items:start; }
        header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
        .panel { background: #fff; border-radius:8px; padding:12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06); }
        #toast { position:fixed; right:18px; bottom:18px; padding:8px 12px; border-radius:6px; background:#222; color:#fff; opacity:0; transform: translateY(6px); transition: all .18s ease; }
        #toast.show { opacity:1; transform: translateY(0); }
      </style>

      <header>
        <div>
          <h1>Agenda Inteligente — AppShell</h1>
          <small>Componente encargado del estado global y persistencia</small>
        </div>
      </header>

      <div class="shell">
        <div class="panel">
          <!-- Nota: contact-input debe ser provisto por otro integrante. -->
          <slot name="left-content">
            <!-- Fallback informativo -->
            <p>Implementa <strong>contact-input</strong> y <strong>contact-list</strong> en tus ramas individuales.</p>
          </slot>
        </div>

        <div class="panel" id="right">
          <slot name="right-content">
            <p>Implementa <strong>stats-card</strong> en otra rama.</p>
          </slot>
        </div>
      </div>

      <div id="toast" role="status" aria-live="polite"></div>
    `;
    
    setTimeout(() => this.updateChildrenProps(), 50);
  }
}

customElements.define('app-dashboard', AppDashboard);
