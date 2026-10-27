import './brand-assets.css';

export function VisionLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`vision-logo ${compact ? 'vision-logo--compact' : ''}`}>
      <img src="/vision3d-logo-transparent.png" alt="Vision3D" />
    </span>
  );
}

export function PrinterAnimation() {
  const shapes = [
    { name: 'carro', path: 'M24 57h8l6-15c2-5 6-8 12-8h31c6 0 10 3 13 8l7 15h7c5 0 9 4 9 9v13h-8a10 10 0 0 1-20 0H49a10 10 0 0 1-20 0h-8V66c0-5 1-7 3-9Zm20 0h47l-6-11c-1-2-3-3-6-3H54c-3 0-5 1-6 4l-4 10Z' },
    { name: 'avião', path: 'M66 16c4 0 7 4 7 9v25l35 20v10L73 69v20l12 9v8l-19-5-19 5v-8l12-9V69L24 80V70l35-20V25c0-5 3-9 7-9Z' },
    { name: 'boneco', path: 'M66 18a14 14 0 1 1 0 28 14 14 0 0 1 0-28Zm-19 34h38c5 0 9 4 9 9v20H82v30H69V84h-6v27H50V81H38V61c0-5 4-9 9-9Z' },
    { name: 'boneca', path: 'M66 17a14 14 0 1 1 0 28 14 14 0 0 1 0-28Zm-14 34h28l17 33H82l8 27H75l-4-27H61l-4 27H42l8-27H35l17-33Z' },
    { name: 'foguete', path: 'M66 14c17 14 23 31 19 52L73 86H59L47 66c-4-21 2-38 19-52Zm0 17a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM46 70 31 83v18l22-10m33-21 15 13v18L79 91M59 91h14l-2 22-5 7-5-7-2-22Z' },
  ];
  return (
    <div className="printer-scene" aria-label="Ilustração animada de uma impressora 3D produzindo uma peça" role="img">
      <div className="printer-glow" />
      <div className="printer-frame">
        <div className="printer-rail"><span className="printer-head"><i /></span></div>
        <div className="printer-filament" />
        <div className="printed-object">
          {shapes.map(shape => <svg key={shape.name} viewBox="0 0 132 124" aria-hidden="true"><path d={shape.path} /></svg>)}
        </div>
        <div className="printer-bed"><i /></div>
        <div className="printer-base"><span>VISION 3D</span><i /></div>
      </div>
      <div className="printer-status"><i /> <span>Imprimindo novas ideias</span></div>
    </div>
  );
}
