interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="state-box error-box" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
