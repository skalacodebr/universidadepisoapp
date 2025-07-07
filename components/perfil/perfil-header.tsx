"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

interface PerfilHeaderProps {
  user: any
  getUserInitial: () => string
  getUserDisplayName: () => string
}

export function PerfilHeader({ user, getUserInitial, getUserDisplayName }: PerfilHeaderProps) {
  return (
    <div className="relative mb-8">
      <div className="h-48 w-full bg-gradient-to-r from-[#007EA3] to-[#00a0c8] rounded-xl"></div>
      <div className="absolute -bottom-16 left-8 flex flex-col sm:flex-row items-start sm:items-end">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-white text-[#007EA3] text-3xl">{getUserInitial()}</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="ml-0 sm:ml-4 mt-3 sm:mt-0 mb-0 sm:mb-2 bg-white p-2 sm:p-0 rounded-md sm:bg-transparent">
          <h2 className="text-2xl font-bold text-[#007EA3]">{getUserDisplayName()}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
    </div>
  )
}
