import Orb from '../Orb';

interface HeroIdleProps {
  starters: readonly string[];
  label: string;
  contactPre: string;
  onPick: (q: string) => void;
}

export default function HeroIdle({ starters, label, contactPre, onPick }: HeroIdleProps) {
  return (
    <div className="hero">
      <Orb size="hero" layoutId="assistant-orb" />
      <p className="hero-label">{label}</p>
      <ul className="starters">
        {starters.map((q) => (
          <li key={q}>
            <button type="button" className="starter" onClick={() => onPick(q)}>
              {q}
            </button>
          </li>
        ))}
      </ul>
      <p className="hero-contact">
        {contactPre}
        <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>
      </p>
    </div>
  );
}
