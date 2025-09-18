import { getUserCookieOnServer } from "@/utils/server-cookie"
import type { ServicesData, ServicesSearchParams } from "@/types/services"
import { ServicesCardList } from "@/components/pages/services/services-list"

type ServicesPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<ServicesSearchParams>
}

export default async function ServicesPage(props: ServicesPageProps) {
  const searchParams = await props.searchParams;
  const { locale } = await props.params
  const resolvedSearchParams = await searchParams

  // Get user and profile data
  const user = await getUserCookieOnServer()
  const userId = user?._id || null

  // Set search parameters with defaults
  const initialSearchParams: ServicesSearchParams = {
    term: resolvedSearchParams.term || "",
    skip: resolvedSearchParams.skip || 0,
    priority: resolvedSearchParams.priority || "score",
    limit: resolvedSearchParams.limit || 20,
  }

  // Fetch initial service data
  let services: ServicesData[] = []
  try {
    // Mock services - replace with hardcoded data
    services = [
      {
        name: "Web Development",
        description: "Professional web development services",
        Profile: {
          _id: "mock-profile-1",
          firstName: "John",
          lastName: "Doe",
          profilePicture: "",
          numServices: 1
        }
      }
    ];
  } catch (error) {
    console.error("Error fetching services:", error)
  }

  return (
    <div>
      <div className="mx-auto px-1 xs:px-2 md:px-4 pt-6 sm:pt-2">
        <ServicesCardList
          services={services}
          locale={locale}
          userId={userId}
          searchParams={initialSearchParams}
        />
      </div>
    </div>
  )
}