# 📈 Automated Data Tracker & Git Scraping Pipeline

![Data Tracker](https://github.com/Slashmanlml/automated-data-tracker/actions/workflows/tracker.yml/badge.svg)
![NodeJS](https://img.shields.io/badge/Node.js-20.x-green?style=flat&logo=node.js)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Cron_Jobs-blue?style=flat&logo=githubactions)
![Flat Data](https://img.shields.io/badge/Architecture-Git_Scraping-orange?style=flat)

Pipeline autónomo de **Git Scraping / Flat Data**. El sistema se despierta de forma programada mediante **Cron Jobs** en GitHub Actions, consulta APIs en tiempo real, procesa los datos y realiza **auto-commits** directos al repositorio para mantener un registro histórico inmutable sin costo de servidores ni bases de datos tradicionales.

---

## ⚙️ ¿Cómo Funciona la Arquitectura?

```text
[GitHub Cron Trigger (00:00 / 12:00 UTC)]
               │
               ▼
[GitHub Actions Runner (Ubuntu)] ───► [Consulta API en Vivo]
               │
               ▼
   [Actualiza data/cotizaciones.json]
               │
               ▼
   [Auto-Commit con github-actions[bot]] ───► [Push automático al Repositorio]
```

---

## 🚀 Características Clave

- **Ejecución Programada (Cron):** Flujo desatendido con expresión cron (`0 0,12 * * *`).
- **Persistencia en Git (Flat Data):** El propio repositorio funciona como base de datos histórica con control de versiones.
- **Detección Inteligente de Cambios:** Solo genera commits si los datos nuevos difieren del estado anterior (`git diff --staged`).
- **Permisos Granulares:** Configuración segura de `permissions: contents: write` con el token interno de GitHub.

---

## 💻 Ejecución Local

```bash
git clone https://github.com/Slashmanlml/automated-data-tracker.git
cd automated-data-tracker
node tracker.js
```
