// Componente para embed de jogadores do Vasco via SofaScore

import React, { useState } from 'react';

const JogadoresIframe = ({
    src = "https://widgets.sofascore.com/pt-BR/embed/player/?widgetTheme=dark",
    title = "Jogadores do Vasco da Gama",
    height = 500,
    style = {},
}) => {
    // Estado de loading para UX
    const [loading, setLoading] = useState(true);

    // Estilo do loader animado
    const loaderStyle = {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.85)',
        zIndex: 2,
        borderRadius: 12,
        fontSize: 20,
        fontWeight: 600,
        color: '#c9a13b',
        animation: 'fadeInIframeLoader 0.5s',
        flexDirection: 'column',
        letterSpacing: '0.5px',
        textAlign: 'center',
        backdropFilter: 'blur(2px)',
    };

    // Loader circular animado
    const loaderCircleStyle = {
        width: 38,
        height: 38,
        border: '4px solid #c9a13b',
        borderTop: '4px solid #fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spinIframeLoader 1s linear infinite, pulseIframeLoader 1.2s cubic-bezier(.77,0,.18,1) infinite alternate',
        marginBottom: 12,
    };

    // Estilo do iframe
    const iframeStyle = {
        borderRadius: 12,
        boxShadow: '0 4px 18px rgba(24,24,24,0.10)',
        minHeight: 320,
        border: 'none',
        width: '100%',
        transition: 'box-shadow 0.35s cubic-bezier(.77,0,.18,1)',
        ...style,
    };

    // Renderização do componente
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: height, ...style }}>
            {/* Loader acessível enquanto carrega */}
            {loading && (
                <div style={loaderStyle} aria-live="polite" aria-busy="true">
                    <span style={loaderCircleStyle} aria-hidden="true" />
                    Carregando jogadores...
                </div>
            )}
            {/* Iframe do widget SofaScore */}
            <iframe
                src={src}
                title={title}
                width="100%"
                height={height}
                frameBorder="0"
                allowFullScreen
                style={iframeStyle}
                onLoad={() => setLoading(false)}
                aria-busy={loading}
                tabIndex={0}
            />
            {/* Keyframes para animação do loader */}
            <style>
                {`
                    @keyframes spinIframeLoader {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes pulseIframeLoader {
                        0% { box-shadow: 0 0 0 0 rgba(201,161,59,0.13);}
                        100% { box-shadow: 0 0 0 12px rgba(201,161,59,0.01);}
                    }
                    @keyframes fadeInIframeLoader {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default JogadoresIframe;
