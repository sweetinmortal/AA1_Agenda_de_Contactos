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
```
### **Integrante 2 – Dalinda Molina**

Implementó el componente **`contact-input`**, encargado de crear, editar y buscar contactos. Sus aportes incluyen:

- Creación del componente base con Shadow DOM y estilos modernos.
- Formulario completo para agregar y editar contactos (nombre, email, teléfono, tags, notas).
- Validaciones, mensajes accesibles (aria-live) y manejo de errores.
- Búsqueda en tiempo real, filtros por etiquetas y botón de búsqueda.
- Emisión de eventos personalizados (`contact:add`, `filter:change`, etc.).
- Vista previa local de contactos en modo demo.
- Tarjetas de resultados, con acciones de Editar y Cerrar.
- Refactorización general del código para optimizar handlers y organización.

### **Integrante 3 – Jerson Calderón**

Implementó los componentes **`contact-item`** y **`contact-list`**, responsables de mostrar, filtrar y gestionar la lista visual de contactos. Sus aportes incluyen:

- Creación de **`contact-item`** con Shadow DOM, estilos, botones de editar, eliminar y favorito, y eventos personalizados (`item:toggle-fav`, `item:edit`, `item:delete`, etc.).
- Creación de **`contact-list`**, capaz de:
    - Recibir la lista completa de contactos y un objeto de filtros.
    - Renderizar cada elemento usando `<contact-item>`.
    - Emitir eventos hacia AppShell igual que cada ítem.
- Lógica de filtrado por nombre, email, teléfono y etiquetas, además de ordenar favoritos primero.
- Render reactivo con actualización automática cuando cambia la lista o los filtros.
- Archivo **demo_input.html** para pruebas, sin modificar el `index.html` del Integrante 1.

### **Integrante 4 - Camila Maldonado**

Implementó los componentes **`stats-card`**, **`app-modal`** y el módulo de utilidades **`storage`**, encargados de mostrar estadísticas, manejar modales reutilizables y gestionar la persistencia local de contactos. Sus aportes incluyen:

- Implementación de funciones en **`storage`**:
    - `getContacts()`: Obtiene los contactos desde localStorage.
    - `saveContacts(contacts)`: Guarda cambios en persistencia.
    - `seedData(force=false)`: Carga datos iniciales sin afectar los existentes (a menos que se fuerce).
- Creación de **`stats-card`**, que realiza:
    - Implementación con Shadow DOM, estilos encapsulados y diseño responsivo.
    - Calculos dinámicos de las estadísticas del total de contactos, porcentaje de favoritos y listado de top tags.
- Creación de **`app-modal`**, el cual es un componente modal reutilizable con Shadow DOM y estilos modernos, este se encarga de emitir eventos personalizados (`modal:confirm`, `modal:close`).
- Creación del Diagrama de Comunicación en README.
