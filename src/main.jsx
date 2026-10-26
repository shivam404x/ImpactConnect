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
    console.error('ImpactConnect Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '36px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#ECFDF5', color: '#16A36A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
              🌍
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.02em' }}>ImpactConnect Notice</h2>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '24px' }}>
              An interface state update was synchronized. Click below to reload your impact workspace.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  try {
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{ background: '#16A36A', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%', transition: 'all 0.2s' }}
              >
                Reload ImpactConnect
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                style={{ background: 'transparent', color: '#64748B', border: '1px solid #CBD5E1', padding: '10px 20px', borderRadius: '14px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', width: '100%' }}
              >
                Clear Local Cache &amp; Fresh Start
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left', fontSize: '11px', color: '#94A3B8' }}>
                <summary style={{ cursor: 'pointer', color: '#64748B', fontWeight: '600' }}>Technical details</summary>
                <pre style={{ marginTop: '8px', overflow: 'auto', background: '#F1F5F9', padding: '12px', borderRadius: '12px', color: '#E11D48', fontFamily: 'monospace', fontSize: '11px' }}>
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
