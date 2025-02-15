# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

**Adding Frontend App Run Instructions to README**

To ensure that users can easily run the frontend application, you can add a section in your README file that outlines the steps to start the application. Here’s a suggested format:

### Running the Frontend Application

To run the frontend application, follow these steps:

1. **Install Dependencies**Make sure you have Node.js installed. Then, navigate to your project directory and run:

```
npm install

```

2. **Start the Development Server**After the dependencies are installed, you can start the development server with:

```
npm run dev

```

3. **Open in Browser**Once the server is running, open your browser and go to:

```
http://localhost:5173

```

   (Note: The port may vary based on your Vite configuration.)

4. **Hot Module Replacement (HMR**)The application supports Hot Module Replacement, so any changes you make to the code will automatically refresh the browser.
