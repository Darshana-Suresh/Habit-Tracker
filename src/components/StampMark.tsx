interface Props {
  color: string;
}

export default function StampMark({ color }: Props) {
  return (
    <div className="stamp">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7.5L5.5 11L12 3"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
