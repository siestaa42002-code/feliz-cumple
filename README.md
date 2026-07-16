# Feliz cumple — web regalo

Sitio estático (HTML/CSS/JS puro, sin build). Secciones: portada, carta typewriter, constelación de recuerdos, galería polaroid y pastel interactivo con confeti.

## Cómo editar el contenido

Todo lo editable está en el bloque `CONFIG` al inicio de `script.js`:

- `nombre`: su nombre o apodo (aparece en la portada y en el título de la pestaña).
- `carta.texto` y `carta.firma`: la carta que se escribe sola.
- `recuerdos[]`: cada objeto es una estrella de la constelación (título corto, fecha libre, texto).
- `fotos[]`: pon los archivos en la carpeta `img/` y escribe la ruta, p. ej. `{ src: "img/nosotros.jpg", caption: "Nosotros" }`. Si `src` queda vacío se muestra un placeholder.
- `deseo.mensajeFinal`: lo que aparece al soplar las velas.

## Probar en local

Abre `index.html` en el navegador, o:

```bash
npx serve .
```

## Publicar (GitHub + Netlify)

1. Crea el repo y sube el código:

```bash
git init
git add .
git commit -m "Web de cumpleaños"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/feliz-cumple.git
git push -u origin main
```

2. En Netlify: **Add new site → Import an existing project → GitHub** → elige el repo.
3. Build command: vacío. Publish directory: `/` (raíz). Deploy.
4. Opcional: cambia el nombre del sitio en **Site settings → Change site name** para una URL bonita tipo `feliz-cumple-nombre.netlify.app`.

Cada `git push` a `main` redespliega solo.
