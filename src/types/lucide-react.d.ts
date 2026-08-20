declare module "lucide-react" {
  import { FC, SVGProps, forwardRef } from "react";

  interface LucideProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  type LucideIcon = FC<LucideProps>;

  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Search: LucideIcon;
  export const Trash2: LucideIcon;
  export const Sparkles: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Info: LucideIcon;
  export const KeyRound: LucideIcon;
  export const Lock: LucideIcon;
  export const Hash: LucideIcon;
  export const Landmark: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Banknote: LucideIcon;
  export const Bitcoin: LucideIcon;
  export const Gift: LucideIcon;
  export const Wallet: LucideIcon;
  export const Clock: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Ban: LucideIcon;
  export const Trophy: LucideIcon;
  export const Building: LucideIcon;
  export const Package: LucideIcon;
  export const Briefcase: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const UserX: LucideIcon;
  export const ArrowRightLeft: LucideIcon;
  export const Link: LucideIcon;
  export const Brain: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Download: LucideIcon;
  export const Phone: LucideIcon;
  export const ShieldOff: LucideIcon;
  export const Type: LucideIcon;
  export const SpellCheck: LucideIcon;
}
