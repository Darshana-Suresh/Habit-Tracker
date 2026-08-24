interface Props {
  label?: string;
}

export default function LoadingState({ label = "Loading…" }: Props) {
  return (
    <div className="state-box">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
