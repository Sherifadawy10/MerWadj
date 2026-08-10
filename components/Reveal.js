export default function Reveal({ children, className = "", delay = 0, as: Component = "div" }) {
  return (
    <Component className={className || undefined} data-anim={delay} suppressHydrationWarning>
      {children}
    </Component>
  );
}
