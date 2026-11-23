import { Fingerprint } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="brand">
        <Fingerprint size={27} />
        <span>THE D-FILES</span>
      </div>
      <span className="division">ACTIVE INVESTIGATIONS</span>
    </header>
  );
}