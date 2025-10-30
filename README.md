<p align="center">
  <a href="https://github.com/buggy-bits/lovable-downloader">
    <img src="assets/logo.png" alt="Lovable Downloader Logo" width="100" height="100">
  </a>
</p>

<h3 align="center">Lovable Downloader</h3>

<p align="center">
  Effortlessly export your <a href="https://lovable.dev">Lovable.dev</a> project source code — fast, clean, and code‑ready.
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License"></a>
</p>

---

## 🚀 About

**Lovable Downloader** helps you easily export the source code of any [Lovable.dev](https://lovable.dev) project.  
Lovable doesn’t offer a free native export option, which can be frustrating when you just want to tweak or back up your work.  

This app lets you convert Lovable’s network response data into fully structured project files — ready for download as a ZIP archive.

---

## 🧩 How It Works

1. **Log in to Lovable**
   - Open [Lovable.dev](https://lovable.dev) and sign in to your account.

2. **Open a Project**
   - Choose the project you want to export.

3. **Load Project Data**
   - Wait for all assets and resources to finish loading.

4. **Capture the Source Code**
   - Open **Developer Tools → Network tab**.
   - Find the request named something like `"source-code"`. (Use filters to locate it faster.)
   - Select it and copy the **response body** — it’s a JSON object containing your project files and structure.

   > If you don’t see it, try refreshing the page once.

5. **Convert JSON to Project**
   - Open the **Lovable Downloader** app.
   - Paste the copied JSON into the provided textarea.
   - Check that the format matches the example placeholder.

6. **Download Your Project**
   - Name the output file, click **Download ZIP**, and you’re done!

---

## 🌱 Local Development

Contributions are welcome and appreciated!

```bash
#Step 1: Fork this repository

#Step 2: Clone your fork
git clone https://github.com/<your-username>/<your-forked-repo>.git

#Step 3: Navigate into the project directory
cd lovable-downloader

#Step 4: Install dependencies
npm install

#Step 5: Start the dev server
npm run dev
```

This project is built with:
- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

---

## 🧾 License

Released under the [MIT License](./LICENSE).  
© 2025 Gadangi Sainag 🙌  

If this tool saves you time, please consider **starring ⭐️** the repository — it helps visibility and shows support.

---

<h4 align="center">Made with ❤️ to simplify Lovable exports</h4>
