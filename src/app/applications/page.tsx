import Link from "next/link";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";

export default async function ApplicationsPage() {
    const user = await getUser();

    const applications = await prisma.application.findMany({
        where: { userId: user!.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <Nav />
            <div className="mx-auto max-w-5xl px-4 py-12">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
                    <Link
                        href="/applications/new"
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        + Add application
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <div className="mt-12 rounded-lg border border-dashed border-gray-300 py-16 text-center">
                        <p className="text-gray-500">
                            You haven&apos;t added any applications yet.
                        </p>
                        <Link
                            href="/applications/new"
                            className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
                        >
                            Add your first application
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-500">Applied</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            <Link href={`/applications/${app.id}`} className="hover:underline">
                                                {app.company}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{app.jobTitle}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {app.appliedAt ? app.appliedAt.toLocaleDateString() : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/applications/${app.id}/edit`}
                                                className="text-gray-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <span className="mx-2 text-gray-300">|</span>
                                            <DeleteApplicationButton
                                                applicationId={app.id}
                                                companyName={app.company}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}