const tpl = document.createElement('template');
tpl.innerHTML = /*html*/`
    <style>
        :host{
            position:fixed;
            inset:0;
            display:none;
            align-items:center;
            justify-content:center;
            z-index:1000;
        }
        :host([open]){
            display:flex;
            background: rgba(0,0,0,0.4);
        }
        .panel{
            background:var(--card-bg,#fff);
            border-radius:8px;
            min-width:320px;
            max-width:90%;
            box-shadow:0 8px 24px rgba(0,0,0,0.2);
            padding:1rem;
        }
        header{
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:0.5rem;
        }
        h3{
            margin:0;
            font-size:1.05rem;
        }
        .actions{
            display:flex;
            gap:0.5rem;
            justify-content:flex-end;
            margin-top:1rem;
        }
        button{
            padding:0.45rem 0.8rem;
            border-radius:6px;
            border:1px solid #ccc;
            background:#f7f7f7;
            cursor:pointer
        }
    </style>
    <div class="panel" role="dialog" aria-modal="true" aria-hidden="true">
        <header>
            <h3 id="title"><slot name="title">Modal</slot></h3>
            <button id="closeBtn" aria-label="Cerrar">✕</button>
        </header>
        <div class="body"><slot></slot></div>
        <div class="actions">
            <slot name="actions">
                <button id="cancel">Cancelar</button>
                <button id="confirm">Confirmar</button>
            </slot>
        </div>
    </div>
`;

export class AppModal extends HTMLElement {
    static get observedAttributes(){ return ['open','title']; }
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(tpl.content.cloneNode(true));
        this._panel = this.shadowRoot.querySelector('.panel');
        this._closeBtn = this.shadowRoot.getElementById('closeBtn');
        this._cancel = this.shadowRoot.getElementById('cancel');
        this._confirm = this.shadowRoot.getElementById('confirm');
        this._onKey = this._onKey.bind(this);
    }

    connectedCallback(){
        this._closeBtn.addEventListener('click', ()=>this.close());
        if (this._cancel) this._cancel.addEventListener('click', ()=>this.close());
        if (this._confirm) this._confirm.addEventListener('click', ()=> {
            this.dispatchEvent(new CustomEvent('modal:confirm',{bubbles:true,composed:true}));
            this.close();
        });
    }

    attributeChangedCallback(name, oldV, newV){
        if (name === 'open'){
            const isOpen = this.hasAttribute('open');
            this._panel.setAttribute('aria-hidden', String(!isOpen));
            document[ isOpen ? 'addEventListener' : 'removeEventListener' ]('keydown', this._onKey);
        }
        if (name === 'title') {
            const h3 = this.shadowRoot.querySelector('#title');
            if (h3) h3.textContent = newV;
        }
    }

    _onKey(e){
        if (e.key === 'Escape') this.close();
    }

    open(){
        this.setAttribute('open','');
        this.dispatchEvent(new CustomEvent('modal:open',{bubbles:true,composed:true}));
    }
    close(){
        this.removeAttribute('open');
        this.dispatchEvent(new CustomEvent('modal:close',{bubbles:true,composed:true}));
    }
}


customElements.define('app-modal', AppModal);
