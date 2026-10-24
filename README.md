# Back office — Los Antojitos de Santanita

> **Rama `santanita` — Los Antojitos de Santanita (Lima).** Mismo panel con la marca de Santanita
> (colores, Shantell Sans + Nunito, logo provisional, soles, teléfonos +51). MongoDB local propio:
> contenedor `santanita-mongo` en el puerto **27018**, base `santanita`. El sitio público
> (`naminam-menu`, rama `santanita`) **todavía no lee esta base**: usa datos estáticos (MVP).
> Pendiente para conectarlos: variantes, estado de stock (en stock / por encargo / agotado) y
> "temporada" en el modelo de productos.
>
> **Modo demo (sin base de datos):** si no hay `MONGODB_URI` (o `DEMO_MODE=true`) el panel usa
> los datos de `scripts/seed-data.json` en memoria y la cuenta demo `demo@santanita.pe` /
> `santanita2026` (se muestra en /login). Los cambios se pierden al reiniciar. Así corre la demo
> pública en Vercel: https://admin-antojitos-santanita.vercel.app

Admin panel for the Ñami Ñam public site: desserts, categories, contact, location, opening
hours and cover photo. Next.js 16 + MongoDB (server-side only).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:up                # local MongoDB in Docker
npm run seed                 # first admin + current menu
npm run dev                  # http://localhost:3001
npm test
```

Photos and videos are not uploaded here: paste a public link (Cloudinary, ImgBB…) and use
"Ver cómo se verá" to preview the menu card before saving.
