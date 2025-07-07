import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface SimulationCardProps {
  id: string;
  titulo: string;
  cliente: string;
  local: string;
  data: string;
  status: "aberta" | "fechada" | "cancelada";
  tipo: "residencial" | "comercial" | "industrial";
}

export function SimulationCard({ id, titulo, cliente, local, data, status, tipo }: SimulationCardProps) {
  const statusConfig = {
    aberta: { color: "bg-yellow-500", icon: <Clock className="h-4 w-4" />, label: "Em aberto" },
    fechada: { color: "bg-green-500", icon: <CheckCircle2 className="h-4 w-4" />, label: "Fechada" },
    cancelada: { color: "bg-red-500", icon: <AlertCircle className="h-4 w-4" />, label: "Cancelada" }
  };

  const tipoConfig = {
    residencial: { label: "Residencial" },
    comercial: { label: "Comercial" },
    industrial: { label: "Industrial" }
  };

  return (
    <Link href={`/simulacao/${id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg line-clamp-1">{titulo}</h3>
          <div className="flex items-center gap-1">
            {statusConfig[status].icon}
            <Badge className={`${statusConfig[status].color} text-white`}>
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <p className="font-medium mb-1">{cliente}</p>
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{local}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{data}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs text-gray-500">{tipoConfig[tipo].label}</span>
          </div>
          <div className="text-xs text-blue-600 font-medium">
            Ver detalhes →
          </div>
        </div>
      </div>
    </Link>
  );
}
