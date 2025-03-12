import { Skeleton } from "@/components/ui/skeleton"

export function ProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    )
}

