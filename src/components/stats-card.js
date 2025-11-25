const tplStats = document.createElement('template');
tplStats.innerHTML = /*html*/`
    <style>
        :host{
            display:block;
            box-shadow:var(--card-shadow,0 4px 12px rgba(0,0,0,0.05));
            border-radius:10px;
            padding:1rem;
            background:var(--card-bg,#fff);
            min-width:220px;
        }
        .grid{
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:0.75rem;
        }
        .stat{
            padding:0.6rem;
            border-radius:8px;
            background:rgba(0,0,0,0.03);
            min-height:56px;
            display:flex;
            flex-direction:column;
            justify-content:center;
        }
        .label{
            font-size:0.8rem;
            color:#555;
        }
        .value{
            font-size:1.25rem;
            font-weight:600;
        }
        .tags{
            margin-top:0.5rem;
            display:flex;
            flex-wrap:wrap;
            gap:0.4rem;
        }
        .tag{
            padding:0.2rem 0.5rem;
            border-radius:999px;
            font-size:0.75rem;
            background:rgba(0,0,0,0.06);
            cursor:pointer;
        }
    </style>
    <div>
        <h4><slot name="title">Estadísticas</slot></h4>
        <div class="grid">
            <div class="stat">
                <div class="label">Total contactos</div>
                <div class="value" id="total">0</div>
            </div>
            <div class="stat">
                <div class="label">Favoritos (%)</div>
                <div class="value" id="favPct">0%</div>
            </div>
            <div style="grid-column:1 / -1">
                <div class="label">Top tags</div>
                <div class="tags" id="tags"></div>
            </div>
        </div>
    </div>
`;

export class StatsCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.shadowRoot.appendChild(tplStats.content.cloneNode(true));
        this._total = this.shadowRoot.getElementById('total');
        this._favPct = this.shadowRoot.getElementById('favPct');
        this._tagsWrap = this.shadowRoot.getElementById('tags');
        this._contacts = [];
    }

    set contacts(v){
        if (!Array.isArray(v)) v = [];
        this._contacts = v;
        this._render();
    }

    get contacts(){ return this._contacts; }

    _render(){
        const total = this._contacts.length;
        const favs = this._contacts.filter(c => c.favorito).length;
        const pct = total === 0 ? 0 : Math.round((favs/total)*100);
        this._total.textContent = String(total);
        this._favPct.textContent = `${pct}%`;
        
        const tagCounts = this._contacts.reduce((acc,c) => {
            (c.tags || []).forEach(t => acc[t] = (acc[t]||0)+1);
            return acc;
        }, {});
        const sorted = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
        this._tagsWrap.innerHTML = '';
        sorted.forEach(([tag, count]) => {
            const el = document.createElement('button');
            el.className = 'tag';
            el.textContent = `${tag} (${count})`;
            el.addEventListener('click', ()=> {
                this.dispatchEvent(new CustomEvent('stats:drilldown', {
                    detail: { tag }, bubbles:true, composed:true
                }));
            });
            this._tagsWrap.appendChild(el);
        });
        if (sorted.length === 0) this._tagsWrap.textContent = '—';
    }
}

customElements.define('stats-card', StatsCard);