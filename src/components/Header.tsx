import { Hand } from "lucide-react";

const Header = () => {
  return (
    <header className="fade-in flex items-center justify-center gap-3 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Hand className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="header-glow text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Speak by Sign
      </h1>
    </header>
  );
};

export default Header;
