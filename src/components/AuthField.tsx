import { motion } from "framer-motion";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  delay?: number;
};

export default function AuthField({ label, icon, delay = 0, type, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="block"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div
        className={`mt-1.5 relative flex items-center rounded-2xl border transition-all duration-300 ${
          focused
            ? "border-[oklch(0.55_0.22_320)] shadow-[0_0_0_4px_oklch(0.55_0.22_320/0.12)] bg-white"
            : "border-[oklch(0.25_0.05_300/0.12)] bg-white/70"
        }`}
      >
        {icon && (
          <span className={`pl-3.5 transition-colors ${focused ? "text-[oklch(0.55_0.22_320)]" : "text-muted-foreground"}`}>
            {icon}
          </span>
        )}
        <input
          {...rest}
          type={inputType}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          className="flex-1 bg-transparent outline-none px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/60"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="pr-3.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </motion.label>
  );
}