import { TrackerGallery } from "@/components/shared/tracker-gallery";

export default function AppHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Trackers</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Choose from product-defined tracker apps. Cricket is active for MVP;
          Sneakers is visible as a planned module only.
        </p>
      </div>
      <TrackerGallery />
    </div>
  );
}
