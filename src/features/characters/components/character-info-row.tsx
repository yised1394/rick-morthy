interface CharacterInfoRowProps {
  readonly label: string;
  readonly value: string;
}

/**
 * Desktop row for displaying character info.
 */
export function CharacterInfoRow({ label, value }: CharacterInfoRowProps) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <dt className="text-sm font-semibold text-gray-800 mb-1">{label}</dt>
      <dd className="text-sm text-gray-500">{value}</dd>
    </div>
  );
}
