// Named imports only (never `import * as Icons`) — lucide-react ships
// thousands of icons, and a wildcard import pulls the entire library into
// the bundle. This curated map covers every icon name used in the app's
// data files, keeping the production bundle small.
import {
  Activity,
  ArrowLeftRight,
  Award,
  BarChart3,
  Binary,
  BookOpen,
  Braces,
  Building2,
  Cake,
  Calculator,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  Clock,
  Coins,
  Divide,
  FileText,
  Fingerprint,
  Flame,
  GraduationCap,
  HandCoins,
  Hash,
  HeartPulse,
  KeyRound,
  Landmark,
  LineChart,
  Percent,
  PiggyBank,
  QrCode,
  Receipt,
  Ruler,
  Scale,
  ShieldCheck,
  Sigma,
  SplitSquareHorizontal,
  Tag,
  TerminalSquare,
  Timer,
  TrendingUp,
  UtensilsCrossed,
  Vault,
  Wallet,
} from "lucide-react";

const ICON_MAP = {
  Activity, ArrowLeftRight, Award, BarChart3, Binary, BookOpen, Braces, Building2, Cake,
  Calculator, CalendarCheck, CalendarClock, CalendarDays, CalendarRange, ClipboardCheck,
  Clock, Coins, Divide, FileText, Fingerprint, Flame, GraduationCap, HandCoins, Hash,
  HeartPulse, KeyRound, Landmark, LineChart, Percent, PiggyBank, QrCode, Receipt, Ruler,
  Scale, ShieldCheck, Sigma, SplitSquareHorizontal, Tag, TerminalSquare, Timer, TrendingUp,
  UtensilsCrossed, Vault, Wallet,
};

// Resolves an icon by string name (as stored in calculatorConfig/categories)
// to the actual lucide-react component, with a safe fallback.
export default function Icon({ name, className = "w-5 h-5", strokeWidth = 1.75 }) {
  const Cmp = ICON_MAP[name] || Calculator;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
