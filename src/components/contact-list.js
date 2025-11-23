// src/components/contact-list.js
/**
 * <contact-list>
 * - Props públicas:
 *    - contacts (Array)  -> lista completa de contactos (padre -> hijo)
 *    - filter (Object)   -> { query: '', tags: [] } (padre -> hijo)
 *    - pageSize (Number) -> opcional (default 12)
 * - Emite:
 *    - contact:select  (cuando un item es seleccionado, opcional)
 *    - item:edit, item:delete, item:toggle-fav se reemiten desde items (burbujeo)
 * - Render: crea <contact-item> por contacto visible
 * - Shadow DOM, accesibilidad
 */

const listTpl = document.createElement('template');
listTpl.innerHTML = /* html */`
  <style>
    :host{ display:block; font-family:system-ui; }
    .wrap{ display:flex; flex-direction:column; gap:10px; }
    .list{ display:grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap:10px; }
    .empty{ padding:12px; border-radius:8px; background:#fff; border:1px dashed #e6eefc; color:#445; text-align:center;}
    .footer{ display:flex; justify-content:center; margin-top:6px; }
    .btn{ padding:8px 12px; border-radius:8px; border:0; cursor:pointer; font-weight:600 }
    .btn.ghost{ background:transparent; border:1px solid #eef3fb }
  </style>

  <div class="wrap" role="region" aria-label="Lista de contactos">
    <div id="list" class="list" role="list"></div>
    <div id="empty" class="empty" hidden>No hay contactos que mostrar</div>
    <div class="footer">
      <button id="btnLoadMore" class="btn ghost" hidden> Cargar más </button>
    </div>
  </div>
`;

export class ContactList extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(listTpl.content.cloneNode(true));

    this.$list = this.shadowRoot.getElementById('list');
    this.$empty = this.shadowRoot.getElementById('empty');
    this.$btnLoadMore = this.shadowRoot.getElementById('btnLoadMore');

    this._contacts = [];
    this._filter = { query:'', tags: [] };
    this._page = 1;
    this._pageSize = 12;

    // binds
    this._onLoadMore = this._onLoadMore.bind(this);
    this._onItemEvent = this._onItemEvent.bind(this);
  }

  connectedCallback(){
    this.$btnLoadMore.addEventListener('click', this._onLoadMore);
    // re-dispatch events from child items as needed by listening to host (events bubble)
    this.addEventListener('item:toggle-fav', this._onItemEvent);
    this.addEventListener('item:edit', this._onItemEvent);
    this.addEventListener('item:delete', this._onItemEvent);
    this.addEventListener('item:request-delete', this._onItemEvent);
  }

  disconnectedCallback(){
    this.$btnLoadMore.removeEventListener('click', this._onLoadMore);
    this.removeEventListener('item:toggle-fav', this._onItemEvent);
    this.removeEventListener('item:edit', this._onItemEvent);
    this.removeEventListener('item:delete', this._onItemEvent);
    this.removeEventListener('item:request-delete', this._onItemEvent);
  }

  // props públicas
  set contacts(arr){
    this._contacts = Array.isArray(arr) ? arr.slice() : [];
    this._page = 1;
    this._render();
  }
  get contacts(){ return this._contacts; }

  set filter(obj){
    this._filter = Object.assign({ query:'', tags:[] }, obj || {});
    this._page = 1;
    this._render();
  }
  get filter(){ return this._filter; }

  set pageSize(n){
    this._pageSize = Number(n) || 12;
    this._page = 1;
    this._render();
  }
  get pageSize(){ return this._pageSize; }

  // Render y helpers
  _render(){
    const visible = this._applyFilter(this._contacts, this._filter);
    const total = visible.length;
    this.$list.innerHTML = '';

    if(!total){
      this.$empty.hidden = false;
      this.$btnLoadMore.hidden = true;
      return;
    } else {
      this.$empty.hidden = true;
    }

    const end = Math.min(this._page * this._pageSize, total);
    const slice = visible.slice(0, end);

    for(const c of slice){
      const item = document.createElement('contact-item');
      // pasar datos por prop pública
      item.contact = c;
      // delegar: no añadir listeners al item, dejamos que eventos burbujeen
      this.$list.appendChild(item);
    }

    // paginación: mostrar botón si hay más
    if(end < total){
      this.$btnLoadMore.hidden = false;
    } else {
      this.$btnLoadMore.hidden = true;
    }
  }

  _applyFilter(list, filter){
    const q = (filter && filter.query || '').toLowerCase();
    const tags = (filter && filter.tags) ? filter.tags.slice() : [];
    if(!q && (!tags || !tags.length)) return list.slice(); // sin filtro

    return list.filter(c => {
      const nombre = (c.nombre || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const telefono = (c.telefono || '').toLowerCase();
      const matchQuery = !q || nombre.includes(q) || email.includes(q) || telefono.includes(q) || (c.id && String(c.id).toLowerCase() === q);
      const matchTags = !tags.length || (c.tags||[]).every(t => tags.includes(t));
      return matchQuery && matchTags;
    });
  }

  _onLoadMore(){
    this._page++;
    this._render();
  }

  // Cuando items despachan eventos, este componente puede capturarlos y reemitirlos
  _onItemEvent(e){
    // e.type puede ser item:toggle-fav / item:edit / item:delete / item:request-delete
    // Reemite tal cual para que AppShell (u otro padre fuera del shadow) lo reciba.
    // Nota: los eventos ya burbujean y composed; reemitimos por claridad o para transformar payload.
    // Evitamos detener la burbuja a menos que tengamos que interceptar (no lo hacemos).
    // Sin cambios: no hacemos nada. Si necesitamos algo centralizado, podríamos mapear.
    // Aquí solo logging opcional (no requerido).
    // console.debug('ContactList captured child event', e.type, e.detail);
  }
}

customElements.define('contact-list', ContactList);
