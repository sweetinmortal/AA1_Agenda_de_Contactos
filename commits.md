 #Aportes Integrante 1 - Anthony León

### **#1. Configurar estructura base del proyecto**

**`chore(repo): agregar LICENSE, .gitignore y estructura base del proyecto`**

---

### **2. Crear AppShell con estado global y propiedades públicas**

**`feat(app-shell): crear AppShell con estado global y propiedades públicas para compartir datos`**

---

### **3. Implementar persistencia con localStorage**

**`feat(app-shell): implementar persistencia de contactos usando storage.js y localStorage`**

---

### **4. Implementar handlers de eventos globales**

**`feat(app-shell): implementar handlers para agregar, editar y eliminar contactos`**

---

### **5. Crear src/index.html y src/main.js**

**`feat(setup): crear index.html y main.js para el registro de componentes`**

---

### **6. Documentar la ejecución del proyecto en README**

**`docs(readme): agregar sección "Cómo ejecutar" con pasos de instalación y ejecución`**

---

### **7. Preparar despliegue en GitHub Pages**

**`chore(deploy): agregar script gh-pages e instrucciones de despliegue`**

---

### **8. Crear rama de trabajo**

**`chore(git): crear rama feature/ig1-appshell`**



# Aportes Integrante 2 - Dalinda Molina
### **1. Crear componente base**

**`feat(contact-input): create initial ContactInput component with form and basic structure`**

---

### **2. Agregar Shadow DOM y estilos**

**`style(contact-input): add Shadow DOM, layout structure and modern UI styling`**

---

### **3. Implementar formulario de agregar contacto**

**`feat(contact-input): implement add-contact form fields and validation (nombre, email, teléfono, tags, notas)`**

---

### **4. Emitir eventos personalizados**

**`feat(contact-input): emit custom events (contact:add, filter:change) with composed + bubbles`**

---

### **5. Añadir funcionalidad de edición**

**`feat(contact-input): implement editing mode with public property editingContact`**

---

### **6. Añadir botones (Agregar, Borrar, Cancelar)**

**`feat(contact-input): add functional form buttons (submit, reset, cancel) with handlers`**

---

### **7. Agregar búsqueda en tiempo real**

**`feat(contact-input): implement live search bar and filter:change event on input`**

---

### **8. Agregar botón Buscar y filtros por tags**

**`feat(contact-input): add search button and tag filtering with input and clear filters`**

---

### **9. Implementar búsqueda local demo**

**`feat(contact-input): add local search demo using internal memory _localContacts`**

---

### **10. Añadir tarjetas de resultado de búsqueda**

**`feat(contact-input): display search result card with details and formatted fields`**

---

### **11. Agregar botones Editar y Cerrar en la tarjeta**

**`feat(contact-input): add Edit and Close actions on search result card`**

---

### **12. Agregar propiedad pública searchResult para comunicación con AppShell**

**`feat(contact-input): expose public setter searchResult for parent-controlled search results`**

---

### **13. Añadir vista previa de contactos locales (solo demo)**

**`feat(contact-input): render local preview list of created/updated contacts`**

---

### **14. Manejo de errores accesibles (aria-live)**

**`a11y(contact-input): add aria-live regions and error messages for validation accessibility`**

---

### **15. Reordenamiento y limpieza del código**

**`refactor(contact-input): clean code, unify handlers and optimize event listeners`**
# Aportes Integrante 3 - Jerson Calderón

1. Creación del componente `contact-item`, encargado de mostrar un contacto con:
    - Nombre, teléfono, email, etiquetas, notas.
    - Botón de favorito (toggle).
    - Botón editar.
    - Botón eliminar.
    - Eventos personalizados:
        - `item:toggle-fav`
        - `item:edit`
        - `item:request-delete`
        - `item:delete`
    - Uso obligatorio de Shadow DOM y estilos internos.
2. Creación del componente `contact-list`, responsable de:
    - Recibir por propiedad pública la lista completa `contacts`.
    - Recibir un objeto `filter` con criterios de búsqueda.
    - Renderizar cada contacto usando `<contact-item>`.
    - Emitir eventos hacia AppShell:
        - `item:toggle-fav`
        - `item:edit`
        - `item:request-delete`
        - `item:delete`
    - Actualizar automáticamente cuando cambian `contacts` o `filter`.
3. Implementación de lógica de:
    - Filtrado por nombre, email, teléfono y etiquetas.
    - Ordenar favoritos primero.
    - Render reactivo usando `this._render()` internamente.
4. Validación funcional en un archivo demo (`demo_input.html`) para pruebas locales:
    - No modifica `index.html` porque esa parte corresponde al Integrante 1 (AppShell).
    - El archivo demo sirve únicamente para validar que los componentes funcionan.
    - Permite comprobar favoritos, edición, filtros y eliminación.
    - Comunicación real entre componentes hijo → hijo y padre simulado.

# Aportes Integrante 4 – Camila Maldonado

1. Creación del módulo `storage.js`, encargado del manejo centralizado de datos, incluyendo:
    - Persistencia local mediante `localStorage`.
    - Gestión de la lista completa de contactos:
        - `loadContacts()`
        - `saveContacts()`
        - `addContact()`
        - `updateContact()`
        - `deleteContact()`
    - Sincronización reactiva entre componentes mediante eventos personalizados:
        - `storage:updated`
    - Aislamiento total de la capa de datos para facilitar mantenimiento y escalabilidad.
    - Diseño independiente del DOM: el módulo funciona sin depender de ningún componente visual.

2. Implementación del componente `app-modal`, responsable de la ventana modal genérica del proyecto, incluyendo:
    - Ventana modal reutilizable basada en Web Components.
    - Uso obligatorio de Shadow DOM con estilos encapsulados.
    - Slots para contenido (`default`) y acciones (`slot="actions"`).
    - Métodos públicos:
        - `open()`
        - `close()`
    - Eventos personalizados:
        - `modal:open`
        - `modal:close`
        - `modal:confirm`
    - Animaciones suaves (`fade-in` / `fade-out`) y bloqueo de interacción del fondo mediante un overlay oscuro.
    - Cierre automático al hacer clic fuera del modal o presionar botones de acción.
    - Integración prevista para confirmaciones de eliminación, edición u operaciones críticas.

3. Creación del componente `stats-card`, encargado de mostrar estadísticas globales de los contactos, incluyendo:
    - Recepción de datos mediante propiedades públicas (`contacts`).
    - Cálculo automático de indicadores:
        - Total de contactos.
        - Total de favoritos.
        - Total de contactos por etiqueta.
    - Renderizado reactivo cuando cambian los datos.
    - Uso de Shadow DOM y estilos internos tipo tarjeta informativa.
    - Componentización modular para su uso dentro de AppShell o demos aisladas.
    - Preparado para integrarse con `storage.js` y actualizarse dinámicamente ante cambios.

4. Validación funcional en archivo demo, permitiendo probar:
    - `storage.js` sin AppShell.
    - Apertura y cierre del modal con contenido de prueba.
    - Cálculo y despliegue de estadísticas en stats-card.
    - Manejo de eventos y comunicación entre módulos.
