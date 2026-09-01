interface Props {
  title?: string;
  subtitle?: string;
}

export default function Hero({
  title = "Habit Tracker",
  subtitle = "Your journey to becoming the best version of yourself!",
}: Props) {
  return (
    <div className="hero">
      <div className="hero-kicker">Field Log</div>
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
    </div>
  );
}
