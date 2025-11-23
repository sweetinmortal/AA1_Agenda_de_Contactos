# agenda_inteligente (AppShell)
Archivos implementados y entregados por Integrante 1:
- `src/app-shell.js` — Componente `<app-dashboard>`: estado global, handlers de eventos, persistencia (localStorage).
- `src/index.html` — Pagina base para desarrollo sin bundlers.
- `src/main.js` — Registra `app-shell.js` (imports).
- `src/utils/storage.js` — Helper para persistencia en localStorage.

## Como ejecutar (local)
1. Descomprime el ZIP y abre la carpeta `src`.
2. Sirve la carpeta `src` con un servidor estatico (recomendado porque usamos modulos ES6):

```bash
cd src
npx http-server -c-1  # o python -m http.server 8000
