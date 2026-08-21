/** Deterministic, brand-consistent palette so the same name always gets
 * the same color, and different people are visually distinguishable
 * without needing real profile photos. */
const PALETTE = [
  { bg: "bg-teal-50", text: "text-teal-600" },
  { bg: "bg-rose-50", text: "text-rose-500" },
  { bg: "bg-amber-50", text: "text-amber-500" },
  { bg: "bg-sky-50", text: "text-sky-500" },
  { bg: "bg-violet-50", text: "text-violet-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-fuchsia-50", text: "text-fuchsia-500" },
  { bg: "bg-orange-50", text: "text-orange-500" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZE_CLASSES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

interface AvatarProps {
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  colorClass?: { bg: string; text: string };
  className?: string;
}

export function Avatar({ name, size = "md", colorClass, className = "" }: AvatarProps) {
  const initials = getInitials(name);
  const colors = colorClass ?? PALETTE[hashString(name) % PALETTE.length];
  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold shrink-0 ${colors.bg} ${colors.text} ${SIZE_CLASSES[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
