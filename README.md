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

## Diagrama de Comunicación
```bash
<contact-input>
        |--(contact:add)----------------------> [<app-dashboard>]
        |                                          |
        |                                          +--(update state)--> [<contact-list>]
        |                                          |
        |                                          +--(prop contacts)--> [<stats-card>]
        |
        |--(filter:change)---------------------> [<app-dashboard>]
                                                   |
                                                   +--(prop filter)----> [<contact-list>]


[<contact-item>]
        |--(item:toggle-fav / item:edit / item:delete)-->
                               |
                               v
                       [<contact-list>] --(bubbles events)--> [<app-dashboard>]


[<app-modal>]
        ^--(prop open)--------------------------- [<app-dashboard>]
```
### **Integrante 1 – Anthony León**
Implementación: 
- AppShell con propiedades públicas.
- Persistencia con localStorage.
- Registro de componentes en main.js.

**Estructura inicial del proyecto**
Creacion de la carpeta base del proyecto:
- agenda_inteligente/
- Definió la estructura principal de carpetas:
        - src/
        - components/
        - utils/
        - styles/
        - assets/

**Lógica Global de la Aplicación**
Implementacion del archivo:
- src/app-shell.js

**Persistencia de Datos**
Se encargo de:
- Guardar los contactos en localStorage
- Recuperar los contactos al iniciar la app
- Sincronizar automáticamente los cambios del estado

**Inicialización del Proyecto**
Implementacion:
src/main.js
Registro de todos los Web Components
Inicialización de <app-dashboard>
Conexión entre la AppShell y los demás componentes

**Estructura HTML base**
Implementacion:
- src/index.html
- Contenedor principal de la aplicación
- Carga del main.js como módulo
- Punto de arranque del sistema

  ---





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

### **Integrante 5 - David Saraguro**

1. Implementación de la **Arquitectura de Estilos Globales**, encargada de unificar la identidad visual del proyecto:
    - Creación de `src/styles/variables.css` para definir **Design Tokens** (colores, espaciados, sombras, tipografía).
    - Creación de `src/styles/global.css` para establecer el **CSS Reset**, estilos base del `body` y tipografía general.
    - Configuración de variables CSS (`:root`) diseñadas para traspasar el Shadow DOM y ser consumidas por los componentes hijos.

2. Integración y **Corrección de Layout en Entornos de Prueba**:
    - Creación de `src/styles/demo-styles.css`, resolviendo la visualización en columnas del archivo `demo_input.html`.
    - Implementación de **Grid Layout** responsivo para dividir la pantalla entre el formulario (Integrante 2) y la lista (Integrante 3).
    - Eliminación de estilos *inline* y vinculación correcta de hojas de estilo en `src/index.html`.

3. Gestión de **Documentación y Entregables Finales**:
    - Organización de la carpeta `src/assets/` e inclusión de recursos gráficos.
    - Redacción completa del **Informe Técnico (PDF)**, cubriendo arquitectura, objetivos y lecciones aprendidas.
    - Diseño del **Diagrama de Comunicación** (Flujo de datos) para el informe y el README.
    - Recopilación y edición del **Video Demostrativo** final para la entrega en Moodle.