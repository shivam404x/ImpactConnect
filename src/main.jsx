import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Vault Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#0f172a', padding: '30px', borderRadius: '24px', border: '1px solid #334155', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>KRMU Vault Notice</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>An interface update took place. Click below to reload your question paper vault.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('krmu_tab_violations');
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{ background: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', width: '100%' }}
              >
                Reload Vault
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', width: '100%' }}
              >
                Clear Cache &amp; Fresh Start
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '16px', textAlign: 'left', fontSize: '11px', color: '#64748b' }}>
                <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Technical details</summary>
                <pre style={{ marginTop: '8px', overflow: 'auto', background: '#020617', padding: '8px', borderRadius: '8px', color: '#f43f5e' }}>
                  {this.state.error.message || String(this.state.error)}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
