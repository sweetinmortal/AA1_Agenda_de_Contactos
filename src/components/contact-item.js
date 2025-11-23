// src/components/contact-item.js
/**
 * <contact-item>
 * - Props públicas:
 *    - contact (Object)  -> asignar el objeto contacto
 * - Emite:
 *    - item:toggle-fav  { id }
 *    - item:edit        { contact }
 *    - item:delete      { id }  (se emite sólo después de confirmación)
 * - Shadow DOM, accesibilidad, styles encapsulados
 */

const itemTpl = document.createElement('template');
itemTpl.innerHTML = /* html */`
  <style>
    :host{
      display:block; --accent: #0b74de; font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
    }
    .item{
      display:flex;
      gap:12px;
      align-items:center;
      padding:10px;
      border-radius:8px;
      background:#fff;
      border:1px solid #eef3fb;
      box-shadow: 0 4px 12px rgba(8,18,40,0.03);
    }
    .avatar{
      width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#e6f3ff,#fff);
      display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent);
      flex:0 0 44px;
    }
    .content{flex:1;min-width:0;}
    .row{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .meta{font-size:0.88rem;color:#556;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tags{font-size:0.8rem;color:#4b5563;margin-top:6px}
    .actions{display:flex;gap:8px}
    button{padding:6px 8px;border-radius:8px;border:0;cursor:pointer;font-weight:600}
    .btn-ghost{background:transparent;border:1px solid #eef3fb;color:#0b294a}
    .btn-fav{background:transparent}
    .fav-on{color:#ef4444} /* red-ish for favorite */
    .small{font-size:0.82rem;color:#667}
  </style>

  <div class="item" role="listitem" aria-label="Contacto">
    <div class="avatar" id="avatar" aria-hidden="true">AA</div>

    <div class="content">
      <div class="row">
        <div style="min-width:0">
          <div id="nombre" style="font-weight:700; font-size:0.98rem; overflow:hidden; text-overflow:ellipsis"></div>
          <div id="meta" class="meta"></div>
        </div>
        <div class="actions" aria-hidden="false">
          <button class="btn-ghost btn-fav" id="btnFav" title="Marcar favorito" aria-label="Marcar favorito">♡</button>
          <button class="btn-ghost" id="btnEdit" title="Editar">Editar</button>
          <button class="btn-ghost" id="btnDelete" title="Eliminar">Eliminar</button>
        </div>
      </div>
      <div class="tags" id="tags"></div>
    </div>
  </div>
`;

export class ContactItem extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(itemTpl.content.cloneNode(true));

    this.$nombre = this.shadowRoot.getElementById('nombre');
    this.$meta = this.shadowRoot.getElementById('meta');
    this.$tags = this.shadowRoot.getElementById('tags');
    this.$avatar = this.shadowRoot.getElementById('avatar');

    this.$btnFav = this.shadowRoot.getElementById('btnFav');
    this.$btnEdit = this.shadowRoot.getElementById('btnEdit');
    this.$btnDelete = this.shadowRoot.getElementById('btnDelete');

    this._contact = null;

    // binds
    this._onFav = this._onFav.bind(this);
    this._onEdit = this._onEdit.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  connectedCallback(){
    this.$btnFav.addEventListener('click', this._onFav);
    this.$btnEdit.addEventListener('click', this._onEdit);
    this.$btnDelete.addEventListener('click', this._onDelete);
    if(!this._rendered) this._render();
  }

  disconnectedCallback(){
    this.$btnFav.removeEventListener('click', this._onFav);
    this.$btnEdit.removeEventListener('click', this._onEdit);
    this.$btnDelete.removeEventListener('click', this._onDelete);
  }

  // Prop pública: contact
  set contact(obj){
    this._contact = obj ? Object.assign({}, obj) : null;
    this._render();
  }
  get contact(){ return this._contact; }

  _render(){
    const c = this._contact;
    if(!c){
      this.$nombre.textContent = '';
      this.$meta.textContent = '';
      this.$tags.textContent = '';
      this.$avatar.textContent = '';
      this.$btnFav.textContent = '♡';
      this.$btnFav.classList.remove('fav-on');
      return;
    }

    // Avatar (iniciales)
    const initials = ((c.nombre||'').split(' ').map(s => s[0]).slice(0,2).join('') || (c.email||'').charAt(0) || '?').toUpperCase();
    this.$avatar.textContent = initials;

    this.$nombre.textContent = c.nombre || '—';
    const metaParts = [];
    if(c.telefono) metaParts.push(c.telefono);
    if(c.email) metaParts.push(c.email);
    this.$meta.textContent = metaParts.join(' • ');
    this.$tags.textContent = (c.tags||[]).join(', ');

    // favorito
    if(c.favorito){
      this.$btnFav.textContent = '♥';
      this.$btnFav.classList.add('fav-on');
      this.$btnFav.setAttribute('aria-pressed', 'true');
    } else {
      this.$btnFav.textContent = '♡';
      this.$btnFav.classList.remove('fav-on');
      this.$btnFav.setAttribute('aria-pressed', 'false');
    }

    // dataset id
    this.setAttribute('data-id', c.id || '');
    this._rendered = true;
  }

  /* Handlers: emiten eventos compuestos y burbujeantes */
  _onFav(e){
    e.preventDefault();
    if(!this._contact || !this._contact.id) return;
    this.dispatchEvent(new CustomEvent('item:toggle-fav', {
      detail: { id: this._contact.id },
      bubbles: true,
      composed: true
    }));
    // toggle visual provisional (optimista)
    this._contact.favorito = !this._contact.favorito;
    this._render();
  }

  _onEdit(e){
    e.preventDefault();
    if(!this._contact) return;
    this.dispatchEvent(new CustomEvent('item:edit', {
      detail: { contact: Object.assign({}, this._contact) },
      bubbles: true,
      composed: true
    }));
  }

  _onDelete(e){
    e.preventDefault();
    if(!this._contact || !this._contact.id) return;
    // confirmar con modal parent (si existe) o fallback confirm()
    // Emitimos un evento 'item:request-delete' para que el parent pueda abrir modal si quiere
    const requestEvent = new CustomEvent('item:request-delete', {
      detail: { id: this._contact.id },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    const prevented = !this.dispatchEvent(requestEvent); // if someone called preventDefault
    // If parent handled (preventDefault()), do not do fallback; parent must emit item:delete when confirmed.
    if(prevented) return;

    // Fallback confirm:
    const ok = window.confirm(`Eliminar contacto "${this._contact.nombre}"?`);
    if(!ok) return;
    this.dispatchEvent(new CustomEvent('item:delete', {
      detail: { id: this._contact.id },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('contact-item', ContactItem);
