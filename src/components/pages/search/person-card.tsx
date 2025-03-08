import Image from "next/image"
import { Mail, Phone, Linkedin, Plus, UserPlus } from "lucide-react"

interface PersonCardProps {
    person: {
        id: number
        name: string
        position: string
        description: string
        coverImage: string
        profileImage: string
    }
}

export function PersonCard({ person }: PersonCardProps) {
    return (
        <div className="bg-white dark:bg-navy rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-32">
                <Image
                    src={person.coverImage || "/placeholder.svg"}
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="relative px-6 pb-6">
                <div className="absolute -top-25 left-1/2 -translate-x-1/2">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white">
                        <Image
                            src={person.profileImage || "/placeholder.svg"}
                            alt={person.name}
                            className="object-cover"
                            fill
                            sizes="96px"
                        />
                    </div>
                </div>
                <div className="mt-14 text-center">
                    <h3 className="text-xl font-semibold">{person.name}</h3>
                    <p className="text-gray-500 text-sm xs:text-md">{person.position}</p>
                    <p className="mt-2 text-gray-600 text-sm xs:text-md">{person.description}</p>

                    <div className="mt-4 flex justify-center gap-2">
                        <button className="p-2 bg-[#001838] text-white rounded-full hover:bg-[#002857]">
                            <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-[#001838] text-white rounded-full hover:bg-[#002857]">
                            <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-[#001838] text-white rounded-full hover:bg-[#002857]">
                            <Linkedin className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-[#001838] text-white rounded-full hover:bg-[#002857]">
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                        </button>
                    </div>

                    <button className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-lg py-2 hover:bg-primary hover:text-white transition-colors">
                        <UserPlus className="h-4 w-4" />
                        Connect
                    </button>
                </div>
            </div>
        </div>
    )
}

