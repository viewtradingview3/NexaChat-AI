type Props = {
  label: string;
  background?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  image?: string;
};

export default function Avatar({
  label,
  background,
  size = "md",
  online,
  image
}: Props) {
  return (
    <div className={`avatar-shell avatar-${size}`}>
      {image ? (
        <img className="avatar-image" src={image} alt={label} />
      ) : (
        <div className="avatar-face" style={{ background }}>
          {label}
        </div>
      )}
      {online && <span className="avatar-online" />}
    </div>
  );
}
