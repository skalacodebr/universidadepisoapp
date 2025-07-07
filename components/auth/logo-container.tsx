interface LogoContainerProps {
  className?: string
}

export function LogoContainer({ className }: LogoContainerProps) {
  return (
    <div className={`hidden md:flex md:w-1/2 bg-white items-center justify-center p-8 ${className}`}>
      <div className="max-w-md flex flex-col items-center">
        <img src="/universidade-piso-logo.jpeg" alt="Universidade do Piso" className="w-64 h-auto" />
      </div>
    </div>
  )
}
