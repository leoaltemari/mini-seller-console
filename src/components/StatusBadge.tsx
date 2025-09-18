interface Props {
  status: string;
  colorsList: Record<string, string>;
}

export default function StatusBadge({ status, colorsList }: Props) {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium
        ${colorsList[status] ?? 'bg-gray-100 text-gray-800'}
      `}
    >
      {status}
    </span>
  );
}