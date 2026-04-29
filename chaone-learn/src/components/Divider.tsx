interface DividerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Divider({ className = "", style }: DividerProps) {
  return (
    <hr
      className={`divider ${className}`}
      style={{
        border: "none",
        borderTop: "var(--border-thin)",
        margin: 0,
        ...style,
      }}
    />
  );
}
