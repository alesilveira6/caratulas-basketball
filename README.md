# 🏀 Generador de Carátulas de Básquet

App web para generar carátulas de jugadores automáticamente desde un Excel, usando la API de Canva.

---

## 🚀 Instalación en Vercel (paso a paso)

### Paso 1 — Subir el código a GitHub

1. Entrá a [github.com](https://github.com) con tu cuenta
2. Hacé clic en el botón verde **"New"** (nuevo repositorio)
3. Nombre: `caratulas-basketball` 
4. Dejá todo por defecto y hacé clic  en **"Create repository"**
5. En la página siguiente, hacé clic en **"uploading an existing file"**
6. Arrastrá TODOS los archivos de esta carpeta (manteniendo la estructura de carpetas)
7. Hacé clic en **"Commit changes"** 
  
### Paso 2 — Conectar con Vercel

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta
2. Hacé clic en **"Add New Project"**
3. Seleccioná **"Import Git Repository"**
4. Elegí el repositorio `caratulas-basketball`
5. Hacé clic en **"Deploy"**
6. ¡Listo! En 2 minutos tenés tu URL: `caratulas-basketball.vercel.app`

### Paso 3 — Configurar el Canva Access Token

Para obtener tu Canva token:
1. Entrá a [canva.com/developers/apps](https://www.canva.com/developers/apps)
2. Creá una nueva app (gratis)
3. Copiá el **Access Token**
4. Pegalo en la app cuando te lo pida

---

## 📋 Uso de la app

1. Abrí tu URL de Vercel
2. Pegá tu **Canva Access Token**
3. Creá un **equipo** (ej: Brasil U18)
4. Subí el **Excel** con los datos del equipo
5. Revisá los jugadores detectados
6. Hacé clic en **"⚡ GENERAR TODO"**
7. Descargá cada PNG directamente desde la app

---

## 📊 Formato del Excel

El Excel debe tener estas columnas (en la hoja 1):

| FOTO | NOMBRE DEL JUGADOR | N° | PUESTO | CARARACTERISTICAS INDIVIDUALES | PTS | 3PTS | ASIS | REB OF | TL |
|------|-------------------|-----|--------|-------------------------------|-----|------|------|--------|-----|
| URL foto | Pietro Melo | 10 | Point Guard | *TIRADOR | 19 | 52% | 3 | - | 66% |
| | | | | *ATAQUE RAPIDO | | | | | |

Cada jugador ocupa 1 fila para los datos principales + filas adicionales para características extra.

---

## 🛠️ Estructura del proyecto

```
caratulas-basketball/
├── api/
│   ├── upload-photo.js    # Sube foto a Canva
│   ├── edit-design.js     # Edita el diseño con datos del jugador
│   ├── export-png.js      # Exporta el diseño como PNG
│   └── proxy-png.js       # Sirve el PNG sin que expire
├── public/
│   └── index.html         # Frontend de la app
├── package.json
├── vercel.json
└── README.md
```

---

## ❓ Preguntas frecuentes

**¿Los PNGs expiran?**
No, gracias al `proxy-png.js` que descarga y sirve el PNG desde nuestro servidor.

**¿Puedo tener múltiples equipos?**
Sí, la app guarda los equipos en el navegador. Cada equipo puede tener su propia plantilla de Canva.

**¿Funciona en celular?**
Sí, la app es responsive y funciona en cualquier dispositivo.
