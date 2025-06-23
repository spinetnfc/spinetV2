import { getUserCookieOnServer } from "@/utils/server-cookie"
import useTranslate from "@/hooks/use-translate"
import type { ServicesData, ServicesSearchParams } from "@/types/services"
import { searchServices } from "@/lib/api/services"
import { ServicesCardList } from "@/components/pages/services/services-list"

type ServicesPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<ServicesSearchParams>
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params
  // Get user and profile data
  const user = await getUserCookieOnServer()
  const userId = user?._id || null

  const searchParams: ServicesSearchParams = {
    term: "",
    skip: 0,
    priority: "score",
    limit: 10,
  }
  // Fetch innitial service data
  let services: ServicesData[] = []
  try {
    services = await searchServices(userId, searchParams)
  } catch (error) {
    console.error("Error fetching contacts:", error)
  }

  return (
    <div className="mx-auto px-1 xs:px-2 md:px-4 pt-6 sm:pt-2">
      <ServicesCardList services={services} locale={locale} />
    </div>
  )
}
