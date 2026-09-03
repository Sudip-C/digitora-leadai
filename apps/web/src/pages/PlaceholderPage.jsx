import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocation } from "react-router";

import { Badge, Button, EmptyState, Modal, useToast } from "../components/ui/index.js";
import { navigationItems } from "../config/navigation.js";

export default function PlaceholderPage() {
  const location = useLocation();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const { showToast } = useToast();

  const closeStatusModal = useCallback(() => {
    setStatusModalOpen(false);
  }, []);
  function handleStatusAcknowledged() {
    closeStatusModal();

    showToast({
      title: "Status checked",
      description: `${currentPage.label} frontend foundation is ready.`,
      variant: "success",
    });
  }
  const currentPage =
    navigationItems.find(({ path }) => path === location.pathname) ?? navigationItems[0];

  return (
    <section aria-labelledby="workspace-title" className="space-y-6">
      <div>
        <Badge variant="brand" dot>
          Frontend foundation
        </Badge>

        <h2 id="workspace-title" className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          {currentPage.label}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{currentPage.description}</p>
      </div>

      <EmptyState
        icon={currentPage.icon}
        title={`${currentPage.label} is ready`}
        description="The interface is prepared for its upcoming feature integration. Real lead data will appear here after the backend is connected."
        action={
          <Button variant="secondary" onClick={() => setStatusModalOpen(true)}>
            View setup status
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        }
      />

      <Modal
        open={statusModalOpen}
        onClose={closeStatusModal}
        title={`${currentPage.label} setup status`}
        description="Part 02 frontend foundation"
        footer={<Button onClick={handleStatusAcknowledged}>Got it</Button>}
      >
        <div className="space-y-4">
          <Badge variant="success" dot>
            Frontend ready
          </Badge>

          <p className="text-sm leading-6 text-muted">
            Responsive navigation, design tokens, and reusable empty states are ready. Live API and
            database integration will be added in its scheduled project part.
          </p>
        </div>
      </Modal>
    </section>
  );
}
