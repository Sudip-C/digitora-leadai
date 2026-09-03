import { Inbox } from "lucide-react";

import Card from "./Card.jsx";

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <Card className="grid min-h-80 place-items-center p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon aria-hidden="true" className="size-7" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </Card>
  );
}
