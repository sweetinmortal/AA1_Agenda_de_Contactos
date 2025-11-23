## Aportes Integrante 3 - Jerson Calderón

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
