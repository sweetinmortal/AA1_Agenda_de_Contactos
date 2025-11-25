export const STORAGE_KEY = 'contacts.v1';

function safeParse(json, fallback = []) {
    try { return JSON.parse(json) || fallback; } catch(e) { return fallback; }
}

export function getContacts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeParse(raw, []);
}

export function saveContacts(contacts) {
    if (!Array.isArray(contacts)) throw new Error('contacts must be an array');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

/*
 * seedData() -> guarda 20 contactos de ejemplo si no hay datos.
 * Devuelve el array final.
 */

export function seedData(force = false) {
    let existing = getContacts();
    if (existing.length > 0 && !force) return existing;

    const tags = ['amigos','trabajo','familia','gym','escuela','proveedores','freelance'];
    const sample = [];
    const month = (n) => `2023-${String(n).padStart(2,'0')}`;

    for (let i=1;i<=20;i++){
        const id = crypto?.randomUUID?.() ?? `id-${Date.now()}-${i}`;
        sample.push({
            id,
            nombre: `Contacto ${i}`,
            telefono: `099${100000 + i}`,
            email: `contacto${i}@ejemplo.com`,
            tags: [tags[i % tags.length], (i % 4 === 0) ? 'amigos' : tags[(i+1) % tags.length]],
            favorito: i % 5 === 0,
            notas: `Nota de ejemplo para contacto ${i}`,
            creado: month((i % 12) + 1)
        });
    }

    saveContacts(sample);
    return sample;
}
