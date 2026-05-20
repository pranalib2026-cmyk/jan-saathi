"use client";
import { useState } from "react";
import { PhoneCall, AlertTriangle, MessageCircle, Info } from "lucide-react";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('call');

  const actions = [
    { id: 'call', label: 'Call Details', Icon: PhoneCall },
    { id: 'report', label: 'Report', Icon: AlertTriangle },
    { id: 'message', label: 'Message', Icon: MessageCircle },
  ];

  return (
    <div style={{ position: 'fixed', left: 16, bottom: 18, zIndex: 60 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
        {actions.map(a => (
          <button
            key={a.id}
            onClick={() => { setSelected(a.id); if (a.id === 'call') setOpen(o => !o); else setOpen(true); }}
            aria-label={a.label}
            title={a.label}
            className="glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.03)',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
            }}
          >
            <a.Icon size={18} />
          </button>
        ))}
      </div>

      {open && (
        <div style={{ marginTop: 12, minWidth: 260 }}>
          <div style={{ padding: 12, borderRadius: 10, background: 'rgba(7,10,17,0.82)', border: '1px solid rgba(255,255,255,0.06)', color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>Cyber Crime — Call Details</div>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ marginBottom: 6 }}><strong>Caller:</strong> +91 98xxxxxx99</div>
              <div style={{ marginBottom: 6 }}><strong>Time:</strong> {new Date().toLocaleString()}</div>
              <div style={{ marginBottom: 6 }}><strong>Location:</strong> Unknown (auto)</div>
              <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Tap the buttons to switch details or close.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
