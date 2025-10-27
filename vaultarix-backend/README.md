# 🧠 Vaultarix Backend

Servidor backend minimalista con autenticación JWT, seguridad básica (Helmet, CORS, Rate Limiter) y estructura escalable.

---

##  Ejecución del servidor

El backend puede ejecutarse en **modo desarrollo** o **modo producción**, según la variable `NODE_ENV`.

---

###  Modo Desarrollo

Usa **nodemon** y JWT con algoritmo **HS256** (clave secreta simple).

#### 📁 Archivo `.env` ejemplo:

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
ALLOWED_ORIGINS=*
DEV_JWT_SECRET=super_dev_secret
ACCESS_TOKEN_EXPIRY=15m
INSTANCE_SEED=dev_instance_seed
```

## Ejecucion
```
npm run dev
```

Esto levanta el servidor con recarga automática y logs detallados.
 JWT en modo dev
Se firma usando HS256.
Se usa la variable DEV_JWT_SECRET.
Ideal para pruebas locales rápidas.

