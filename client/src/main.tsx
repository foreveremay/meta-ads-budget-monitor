import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('渲染錯誤:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px;">
      <h1>渲染錯誤</h1>
      <pre>${String(error)}</pre>
    </div>`;
  }
} else {
  console.error('找不到 root 元素!');
  document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>錯誤：找不到 root 元素</h1></div>';
}
