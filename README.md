# Ñami Ñam — Back office

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
