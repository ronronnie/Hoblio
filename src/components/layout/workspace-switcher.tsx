import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceSwitcher() {
  return (
    <Button variant="outline" className="justify-between">
      Default Workspace
      <ChevronDown className="ml-2 size-4" aria-hidden="true" />
    </Button>
  );
}
