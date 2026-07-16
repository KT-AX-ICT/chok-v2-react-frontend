import ThemeToggle from "../ui/ThemeToggle";
import "../../styles/components/sidebar.css";

export default function Header() {
  return (
    <div className="app-header">
      <ThemeToggle />
    </div>
  );
}
