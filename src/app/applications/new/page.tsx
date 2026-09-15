import { Nav } from "@/components/Nav";
import { ApplicationForm } from "@/components/ApplicationForm";
import { createApplication } from "@/lib/actions/applications";

export default function NewApplicationPage() {
  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">Add application</h1>
        <div className="mt-6">
          <ApplicationForm action={createApplication} submitLabel="Add application" />
        </div>
      </div>
    </div>
  );
}