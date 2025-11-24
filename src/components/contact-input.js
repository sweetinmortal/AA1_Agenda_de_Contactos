// src/components/contact-input.js
/**
 * <contact-input>
 * - Formulario Add / Edit
 * - Barra de búsqueda + filtro tags + botón Buscar
 * - Muestra el contacto encontrado con sus datos (card con Editar / Cerrar)
 * - Emite: contact:add, contact:update, filter:change
 * - Public API:
 *    - editingContact (setter) -> pone el formulario en modo edición
 *    - searchResult (setter) -> muestra un resultado de búsqueda (puede venir del parent)
 * - Shadow DOM, accesibilidad y CustomEvent { bubbles: true, composed: true }
 */

const tpl = document.createElement('template');
tpl.innerHTML = /* html */`
  <style>
    :host{
      --accent: #0b74de;
      --bg: #fff;
      --muted: #6b7280;
      display:block; max-width:700px;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
    }
    .card{
      background:var(--bg);
      border-radius:10px;
      padding:14px;
      box-shadow: 0 6px 16px rgba(12,20,40,0.06);
    }
    .title { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; }
    .title h3 { margin:0; font-size:1.05rem; }
    .muted{ color: var(--muted); font-size:0.88rem; }

    /* search */
    .searchbar{ display:flex; gap:8px; margin-bottom:12px; align-items:center; }
    .searchbar input[type="search"], .searchbar input[type="text"]{
      padding:8px 10px; border-radius:8px; border:1px solid #e9eef6; flex:1;
    }
    .btn{
      display:inline-flex; align-items:center; gap:8px;
      padding:8px 12px; border-radius:8px; border:0; cursor:pointer; user-select:none;
      font-weight:600;
    }
    .btn.primary{ background:var(--accent); color:#fff; }
    .btn.ghost{ background:transparent; border:1px solid #e6eefc; color: #0b294a; }
    .btn.warn{ background:#f9f0f0; color:#9a2b2b; font-weight:600; }

    form{ display:grid; gap:8px; }
    label{ font-size:0.86rem; color:var(--muted); display:block; margin-bottom:4px; }
    input[type="text"], input[type="email"], textarea{
      width:90%; padding:8px 10px; border-radius:8px; border:1px solid #e9eef6; font-size:0.95rem;
    }
    .row{ display:flex; gap:8px; }
    .row > *{ flex:1; }

    .controls{ display:flex; gap:8px; justify-content:flex-end; margin-top:6px; }
    .error{ color:#b91c1c; font-size:0.85rem; padding:6px; border-radius:6px; background:#fff5f5; display:none; }
    .live{ font-size:0.85rem; color:var(--muted); min-height:18px; }

    .small{ font-size:0.82rem; color:var(--muted); }
    .preview-list{ margin-top:12px; padding-top:8px; border-top:1px dashed #eef3fb; }

    /* search result card */
    .result-card{
      margin-top:12px;
      padding:10px;
      border-radius:8px;
      border:1px solid #e6eefc;
      background:linear-gradient(180deg, #fbfdff, #ffffff);
      display:none;
    }
    .result-row{ display:flex; justify-content:space-between; gap:8px; align-items:center; }
    .result-fields{ margin-top:8px; display:grid; gap:6px; font-size:0.95rem }
    .result-fields b{ font-weight:700; }
    .result-actions{ margin-top:8px; display:flex; gap:8px; justify-content:flex-end; }
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  </style>

  <div class="card" role="region" aria-label="Formulario y búsqueda de contactos">
    <div class="title">
      <div>
        <h3 id="modeTitle">Agregar contacto</h3>
        <div class="muted" id="subtitle">Crear, editar y buscar contactos</div>
      </div>
      <div>
        <button class="btn ghost" id="btnClearAll" title="Limpiar todo">Limpiar</button>
      </div>
    </div>

    <!-- Búsqueda y filtro tags -->
    <div class="searchbar" role="search" aria-label="Buscar contactos">
      <label for="q" class="sr-only">Buscar</label>
      <input id="q" type="search" placeholder="Busca por nombre, email o teléfono" aria-label="Buscar contactos" />
      <button class="btn ghost" id="btnSearch" title="Buscar">Buscar</button>
      <button class="btn ghost" id="btnClearFilters" title="Limpiar filtros">Limpiar filtros</button>
    </div>

    <form id="form" novalidate>
      <input id="id" type="hidden" aria-hidden="true" />

      <div>
        <label for="nombre">Nombre <span aria-hidden="true">*</span></label>
        <input id="nombre" name="nombre" type="text" autocomplete="name" required aria-required="true" />
        <div id="err-nombre" class="error" role="alert" aria-live="assertive"></div>
      </div>

      <div class="row">
        <div>
          <label for="telefono">Teléfono</label>
          <input id="telefono" name="telefono" type="text" inputmode="tel" placeholder="+5939..." />
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" inputmode="email" placeholder="ejemplo@correo.com" />
          <div id="err-email" class="error" role="alert" aria-live="assertive"></div>
        </div>
      </div>

      <div>
        <label for="tags">Etiquetas</label>
        <input id="tags" name="tags" type="text" placeholder="amigos, trabajo" />
      </div>

      <div>
        <label for="notas">Notas</label>
        <textarea id="notas" name="notas" rows="3" placeholder="Notas opcionales"></textarea>
      </div>

      <div class="controls">
        <button type="button" class="btn ghost" id="btnCancel" hidden aria-hidden="true">Cancelar</button>
        <button type="reset" class="btn ghost" id="btnReset">Borrar</button>
        <button type="submit" class="btn primary" id="btnSubmit">Agregar</button>
      </div>

      <div class="live" id="liveStatus" aria-live="polite"></div>
    </form>

    <!-- resultado de busqueda -->
    <div class="result-card" id="resultCard" role="status" aria-live="polite">
      <div class="result-row">
        <div><strong>Contacto encontrado</strong></div>
        <div class="muted" id="resultMeta"></div>
      </div>
      <div class="result-fields" id="resultFields"></div>
      <div class="result-actions">
        <button class="btn ghost" id="btnResultClose">Cerrar</button>
        <button class="btn primary" id="btnResultEdit">Editar</button>
      </div>
    </div>

    <!-- preview local (solo demo, no persist) -->
    <div class="preview-list" id="previewList" aria-live="polite"></div>
  </div>
`;

export class ContactInput extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));

    // elements
    this.$q = this.shadowRoot.getElementById('q');
    this.$tagsFilter = this.shadowRoot.getElementById('tagsFilter');
    this.$btnSearch = this.shadowRoot.getElementById('btnSearch');
    this.$btnClearFilters = this.shadowRoot.getElementById('btnClearFilters');
    this.$btnClearAll = this.shadowRoot.getElementById('btnClearAll');

    this.$form = this.shadowRoot.getElementById('form');
    this.$id = this.shadowRoot.getElementById('id');
    this.$nombre = this.shadowRoot.getElementById('nombre');
    this.$telefono = this.shadowRoot.getElementById('telefono');
    this.$email = this.shadowRoot.getElementById('email');
    this.$tags = this.shadowRoot.getElementById('tags');
    this.$notas = this.shadowRoot.getElementById('notas');

    this.$errNombre = this.shadowRoot.getElementById('err-nombre');
    this.$errEmail = this.shadowRoot.getElementById('err-email');
    this.$btnSubmit = this.shadowRoot.getElementById('btnSubmit');
    this.$btnReset = this.shadowRoot.getElementById('btnReset');
    this.$btnCancel = this.shadowRoot.getElementById('btnCancel');
    this.$modeTitle = this.shadowRoot.getElementById('modeTitle');
    this.$live = this.shadowRoot.getElementById('liveStatus');
    this.$preview = this.shadowRoot.getElementById('previewList');

    this.$resultCard = this.shadowRoot.getElementById('resultCard');
    this.$resultFields = this.shadowRoot.getElementById('resultFields');
    this.$resultMeta = this.shadowRoot.getElementById('resultMeta');
    this.$btnResultClose = this.shadowRoot.getElementById('btnResultClose');
    this.$btnResultEdit = this.shadowRoot.getElementById('btnResultEdit');

    // state
    this._editingContact = null;
    this._localContacts = []; // contactos creados desde este componente (solo demo/local)
    this._lastSearch = null;

    // binds
    this._onSubmit = this._onSubmit.bind(this);
    this._onReset = this._onReset.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onSearchClick = this._onSearchClick.bind(this);
    this._onTagsFilter = this._onTagsFilter.bind(this);
    this._onClearFilters = this._onClearFilters.bind(this);
    this._onClearAll = this._onClearAll.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onResultClose = this._onResultClose.bind(this);
    this._onResultEdit = this._onResultEdit.bind(this);
  }

  connectedCallback(){
    this.$form.addEventListener('submit', this._onSubmit);
    this.$btnReset.addEventListener('click', this._onReset);
    this.$btnCancel.addEventListener('click', this._onCancel);
    this.$q.addEventListener('input', this._onSearch);
    this.$btnSearch.addEventListener('click', this._onSearchClick);
    this.$tagsFilter.addEventListener('input', this._onTagsFilter);
    this.$btnClearFilters.addEventListener('click', this._onClearFilters);
    this.$btnClearAll.addEventListener('click', this._onClearAll);
    this.shadowRoot.addEventListener('keydown', this._onKeyDown);

    this.$btnResultClose.addEventListener('click', this._onResultClose);
    this.$btnResultEdit.addEventListener('click', this._onResultEdit);
  }

  disconnectedCallback(){
    this.$form.removeEventListener('submit', this._onSubmit);
    this.$btnReset.removeEventListener('click', this._onReset);
    this.$btnCancel.removeEventListener('click', this._onCancel);
    this.$q.removeEventListener('input', this._onSearch);
    this.$btnSearch.removeEventListener('click', this._onSearchClick);
    this.$tagsFilter.removeEventListener('input', this._onTagsFilter);
    this.$btnClearFilters.removeEventListener('click', this._onClearFilters);
    this.$btnClearAll.removeEventListener('click', this._onClearAll);
    this.shadowRoot.removeEventListener('keydown', this._onKeyDown);

    this.$btnResultClose.removeEventListener('click', this._onResultClose);
    this.$btnResultEdit.removeEventListener('click', this._onResultEdit);
  }

  // Prop pública: editingContact
  set editingContact(obj){
    if(!obj){
      this._editingContact = null;
      this._fillForm(null);
      return;
    }
    this._editingContact = Object.assign({}, obj);
    this._fillForm(this._editingContact);
  }
  get editingContact(){ return this._editingContact; }

  // Prop pública: searchResult -> permite al parent inyectar un resultado para mostrarlo
  set searchResult(obj){
    if(!obj){
      this._clearSearchResult();
      return;
    }
    // guardar como última búsqueda para poder editar desde la tarjeta
    this._lastSearch = Object.assign({}, obj);
    this._renderSearchResult(this._lastSearch);
  }
  get searchResult(){ return this._lastSearch; }

  // Rellena el form con datos (o limpia si null)
  _fillForm(contact){
    if(!contact){
      this.$id.value = '';
      this.$nombre.value = '';
      this.$telefono.value = '';
      this.$email.value = '';
      this.$tags.value = '';
      this.$notas.value = '';
      this.$btnCancel.hidden = true;
      this.$btnCancel.setAttribute('aria-hidden', 'true');
      this.$btnSubmit.textContent = 'Agregar';
      this.$modeTitle.textContent = 'Agregar contacto';
      this.$live.textContent = '';
      this.$errNombre.style.display = 'none';
      this.$errEmail.style.display = 'none';
      return;
    }
    this.$id.value = contact.id || '';
    this.$nombre.value = contact.nombre || '';
    this.$telefono.value = contact.telefono || '';
    this.$email.value = contact.email || '';
    this.$tags.value = (contact.tags || []).join(', ');
    this.$notas.value = contact.notas || '';
    this.$btnCancel.hidden = false;
    this.$btnCancel.removeAttribute('aria-hidden');
    this.$btnSubmit.textContent = 'Actualizar';
    this.$modeTitle.textContent = 'Editar contacto';
    this.$live.textContent = 'Modo edición';
  }

  // util: validar
  _validate(){
    let ok = true;
    const nombre = this.$nombre.value.trim();
    const email = this.$email.value.trim();

    this.$errNombre.style.display = 'none';
    this.$errEmail.style.display = 'none';
    this.$errNombre.textContent = '';
    this.$errEmail.textContent = '';

    if(!nombre){
      this.$errNombre.textContent = 'El nombre es obligatorio';
      this.$errNombre.style.display = 'block';
      ok = false;
    }

    if(email){
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!re.test(email)){
        this.$errEmail.textContent = 'Email inválido';
        this.$errEmail.style.display = 'block';
        ok = false;
      }
    }

    return ok;
  }

  // construye objeto contact desde el form
  _getContactFromForm(){
    const id = this.$id.value || undefined;
    const nombre = this.$nombre.value.trim();
    const telefono = this.$telefono.value.trim();
    const email = this.$email.value.trim();
    const tags = (this.$tags.value || '').split(',').map(t => t.trim()).filter(Boolean);
    const notas = this.$notas.value.trim();
    return { id, nombre, telefono, email, tags, notas };
  }

  // Handlers
  _onSubmit(e){
    e.preventDefault();
    if(!this._validate()){
      this.$live.textContent = 'Corrige los errores en el formulario';
      return;
    }

    const contact = this._getContactFromForm();

    if(contact.id){
      // update
      this._updateLocalContact(contact);
      this.dispatchEvent(new CustomEvent('contact:update', {
        detail: { contact },
        bubbles: true,
        composed: true
      }));
      this.$live.textContent = 'Contacto actualizado';
    } else {
      // add
      // enviamos al padre (AppShell) sin id - el padre puede asignarla
      this.dispatchEvent(new CustomEvent('contact:add', {
        detail: { contact },
        bubbles: true,
        composed: true
      }));
      // Para demo/local, añadimos una copia con id local (no sobreescribe lo enviado)
      const localCopy = Object.assign({}, contact, { id: contact.id || ('local_' + Date.now()) });
      this._addLocalContact(localCopy);
      this.$live.textContent = 'Contacto agregado';
      // limpiar form automáticamente después de agregar
      this._fillForm(null);
    }
  }

  _onReset(){
    // limpiar campos visibles, no cambia editingContact
    this._fillForm(null);
    this.$live.textContent = 'Formulario borrado';
  }

  _onCancel(){
    // salir de modo edición
    this.editingContact = null;
    this.dispatchEvent(new CustomEvent('filter:change', {
      detail: { query: '' },
      bubbles: true,
      composed: true
    }));
    this.$live.textContent = 'Edición cancelada';
  }

  _onSearch(){
    // se dispara en cada input (live filtering) -> emite filter:change
    const q = this.$q.value.trim();
    this.dispatchEvent(new CustomEvent('filter:change', {
      detail: { query: q },
      bubbles: true,
      composed: true
    }));
  }

  _onSearchClick(){
    // botón Buscar: emite filter:change y realiza búsqueda local en _localContacts
    const q = this.$q.value.trim();
    const tags = (this.$tagsFilter.value || '').split(',').map(t=>t.trim()).filter(Boolean);

    // emite a parent para que también haga su filtrado
    this.dispatchEvent(new CustomEvent('filter:change', {
      detail: { query: q, tags },
      bubbles: true,
      composed: true
    }));

    // búsqueda local (demo) - busca por nombre/email/telefono (contains)
    if(!q && !tags.length) {
      this.$live.textContent = 'Ingresa término de búsqueda o tags';
      return;
    }

    const term = q.toLowerCase();
    let found = null;

    // Prioridad: coincidencia exacta en id o nombre/email/telefono incluye term
    for(const c of this._localContacts){
      if(c.id && c.id === q){ found = c; break; }
    }
    if(!found){
      for(const c of this._localContacts){
        const nombre = (c.nombre || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const tel = (c.telefono || '').toLowerCase();
        const tagMatch = !tags.length || (c.tags || []).every(t => tags.includes(t));
        if(tagMatch && (term && (nombre.includes(term) || email.includes(term) || tel.includes(term)))){
          found = c;
          break;
        }
      }
    }

    if(found){
      this._lastSearch = found;
      this._renderSearchResult(found);
      this.$live.textContent = 'Contacto encontrado (local)';
    } else {
      // no encontrado local -> limpiar resultado y notificar
      this._clearSearchResult();
      this.$live.textContent = 'No se encontró localmente. El parent puede filtrar los resultados.';
    }
  }

  _onTagsFilter(){
    const tags = (this.$tagsFilter.value || '').split(',').map(t=>t.trim()).filter(Boolean);
    this.dispatchEvent(new CustomEvent('filter:change', {
      detail: { tags },
      bubbles: true,
      composed: true
    }));
  }

  _onClearFilters(){
    this.$q.value = '';
    this.$tagsFilter.value = '';
    this.dispatchEvent(new CustomEvent('filter:change', {
      detail: { query: '', tags: [] },
      bubbles: true,
      composed: true
    }));
    this.$live.textContent = 'Filtros limpiados';
    this._clearSearchResult();
  }

  _onClearAll(){
    // limpia todo el form y filtros
    this._fillForm(null);
    this._onClearFilters();
    this.$live.textContent = 'Formulario y filtros limpiados';
    this._localContacts = [];
    this.$preview.innerHTML = '';
    this._clearSearchResult();
  }

  _onKeyDown(evt){
    // permitir Enter en búsqueda para disparar búsqueda
    if(evt.key === 'Enter' && (evt.target === this.$q || evt.target === this.$tagsFilter)) {
      evt.preventDefault();
      if(evt.target === this.$q) this._onSearchClick();
      if(evt.target === this.$tagsFilter) this._onTagsFilter();
    }
  }

  _onResultClose(){
    this._clearSearchResult();
    this.$live.textContent = 'Resultado cerrado';
  }

  _onResultEdit(){
    if(!this._lastSearch) return;
    // pasar el contacto al formulario para editar
    const contactToEdit = Object.assign({}, this._lastSearch);
    // set editingContact (prop pública)
    this.editingContact = contactToEdit;
    this.$live.textContent = 'Editando contacto encontrado';
    // cerrar card
    this._clearSearchResult();
  }

  // demo: local CRUD en _localContacts (solo para preview & búsqueda local)
  _addLocalContact(contact){
    // asegura id local si no hay
    if(!contact.id) contact.id = 'local_' + Date.now();
    // evitar duplicado por id
    const idx = this._localContacts.findIndex(c => c.id === contact.id);
    if(idx > -1) {
      this._localContacts[idx] = contact;
    } else {
      this._localContacts.unshift(contact);
    }
    this._appendPreview(contact);
  }

  _updateLocalContact(contact){
    if(!contact.id) return;
    const idx = this._localContacts.findIndex(c => c.id === contact.id);
    if(idx > -1) {
      this._localContacts[idx] = contact;
      // actualizar preview (simple)
      const items = Array.from(this.$preview.children);
      const found = items.find(i => i.dataset.id === contact.id);
      if(found) found.textContent = `${contact.nombre} • ${contact.email || ''} ${contact.tags ? ' • ' + contact.tags.join(', ') : ''}`;
    } else {
      // si no existe local, insertarlo
      this._localContacts.unshift(contact);
      this._appendPreview(contact);
    }
  }

  // demo: añade preview visual dentro del componente para verificar los datos emitidos
  _appendPreview(contact){
    try {
      if(!contact || !contact.nombre) return;
      const el = document.createElement('div');
      el.className = 'small';
      el.dataset.id = contact.id || ('tmp_' + Date.now());
      const tags = (contact.tags || []).length ? ` • ${contact.tags.join(', ')}` : '';
      el.textContent = `${contact.nombre} ${contact.email ? ' • ' + contact.email : ''}${tags}`;
      this.$preview.prepend(el);
      // mantener max 8 elementos
      while(this.$preview.children.length > 8) this.$preview.removeChild(this.$preview.lastChild);
    } catch(e){
      console.warn(e);
    }
  }

  // Renderiza la tarjeta de resultado con detalles
  _renderSearchResult(contact){
    if(!contact) return this._clearSearchResult();
    this.$resultFields.innerHTML = `
      <div><b>Nombre:</b> ${this._esc(contact.nombre)}</div>
      <div><b>Teléfono:</b> ${this._esc(contact.telefono || '—')}</div>
      <div><b>Email:</b> ${this._esc(contact.email || '—')}</div>
      <div><b>Etiquetas:</b> ${this._esc((contact.tags||[]).join(', ') || '—')}</div>
      <div><b>Notas:</b> ${this._esc(contact.notas || '—')}</div>
    `;
    this.$resultMeta.textContent = contact.id ? `id: ${contact.id}` : '';
    this.$resultCard.style.display = 'block';
  }

  _clearSearchResult(){
    this.$resultCard.style.display = 'none';
    this.$resultFields.innerHTML = '';
    this.$resultMeta.textContent = '';
    this._lastSearch = null;
  }

  _esc(str){
    if(!str) return '';
    return String(str).replaceAll('<','&lt;').replaceAll('>','&gt;');
  }
}

customElements.define('contact-input', ContactInput);
