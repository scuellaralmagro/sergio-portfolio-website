import Orb from '../Orb';

interface HeroIdleProps {
  starters: string[];
  onPick: (q: string) => void;
}

export default function HeroIdle({ starters, onPick }: HeroIdleProps) {
  return (
    <div className="hero">
      <Orb size="hero" layoutId="assistant-orb" />
      <p className="hero-label">Try asking</p>
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
        Prefer email? <a href="mailto:info@sergiocuellar.dev">info@sergiocuellar.dev</a>
      </p>
    </div>
  );
}
