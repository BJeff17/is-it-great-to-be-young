import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';
import { useDeck } from '../../context/DeckContext';

export const TabRemote: React.FC = () => {
  const {
    config,
    networkInfo,
    sessionId,
    isPublicHost,
    wsConnected,
    syncTransport,
    peers,
    updateConfig,
    regenerateSession,
  } = useDeck();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const defaultBase = isPublicHost
    ? window.location.origin
    : `${networkInfo.protocol}://${networkInfo.lanIp}:${networkInfo.port}`;
  const baseUrl = (config.customBaseUrl.trim() || defaultBase).replace(/\/+$/, '');
  const remoteUrl = `${baseUrl}/remote?session=${encodeURIComponent(sessionId)}`;
  const presenterUrl = `${window.location.origin}/presenter?session=${encodeURIComponent(sessionId)}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(remoteUrl, {
      width: 220,
      margin: 1,
      color: { dark: '#09090b', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });
    return () => {
      active = false;
    };
  }, [remoteUrl]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(remoteUrl).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  const transportLabel =
    syncTransport === 'cloud-p2p'
      ? wsConnected
        ? 'Cloud P2P · Vercel (4G/Wi-Fi)'
        : 'Connexion Cloud P2P...'
      : wsConnected
        ? 'Sync LAN WebSocket actif'
        : 'Reconnexion Sync...';

  return (
    <>
      <div className="studio-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span
              className="remote-dot"
              style={{
                background: wsConnected ? '#10b981' : '#f59e0b',
                boxShadow: wsConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
              }}
            />
            <span>{transportLabel}</span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: peers.remotes > 0 ? '#6ee7b7' : '#94a3b8',
            }}
          >
            {peers.remotes} tél · {peers.presenters} cons
          </span>
        </div>
      </div>

      <div className="qr-box">
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className="studio-section-title" style={{ marginBottom: 0 }}>
            {isPublicHost
              ? `Session ${sessionId} (4G / Wi-Fi)`
              : `Scanner sur Wi-Fi (Session ${sessionId})`}
          </div>
          <button
            className="secondary-btn"
            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.68rem' }}
            onClick={regenerateSession}
            title="Générer un nouveau code de session"
          >
            <RefreshCw size={12} />
            <span>Nouveau code</span>
          </button>
        </div>

        {qrDataUrl && <img className="qr-img" src={qrDataUrl} alt="QR Code télécommande mobile" />}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: '#cbd5e1',
            wordBreak: 'break-all',
            textAlign: 'center',
          }}
        >
          {remoteUrl}
        </div>
        <div className="btn-pair" style={{ width: '100%' }}>
          <button className="secondary-btn" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copié !' : 'Copier URL'}</span>
          </button>
          <a
            className="secondary-btn"
            href={`/remote?session=${encodeURIComponent(sessionId)}`}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Smartphone size={14} />
            <span>Tester ici</span>
          </a>
        </div>
      </div>

      <div>
        <div className="studio-section-title">Adresse Réseau / Tunnel (optionnel)</div>
        <input
          className="url-input"
          type="text"
          placeholder={defaultBase}
          value={config.customBaseUrl}
          onChange={(e) => updateConfig({ customBaseUrl: e.target.value })}
        />
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>
          {isPublicHost ? (
            <>Hébergé en ligne : fonctionne directement depuis n’importe quel téléphone en 4G/5G ou Wi-Fi.</>
          ) : (
            <>
              IP Wi-Fi détectée : <strong style={{ color: '#fde68a' }}>{networkInfo.lanIp}</strong> (port{' '}
              {networkInfo.port}). Laisse vide pour utiliser l’IP locale automatiquement.
            </>
          )}
        </div>
      </div>

      <div>
        <div className="studio-section-title">Console 2e Écran (O)</div>
        <button
          className="secondary-btn"
          onClick={() => window.open(presenterUrl, 'JeffPresenterConsole', 'width=980,height=740')}
        >
          <ExternalLink size={14} />
          <span>Ouvrir Console Présentateur</span>
        </button>
      </div>
    </>
  );
};
