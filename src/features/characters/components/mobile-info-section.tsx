interface MobileInfoSectionProps {
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

/**
 * Mobile section for displaying character info.
 */
export function MobileInfoSection({
  label,
  value,
  className = "",
}: MobileInfoSectionProps) {
  return (
    <div className={className}>
      <dt className="text-base font-bold text-gray-800 tracking-tight mb-1.5">
        {label}
      </dt>
      <dd className="text-[15px] text-gray-500">{value}</dd>
    </div>
  );
}
