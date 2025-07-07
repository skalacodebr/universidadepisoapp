"use client"

import { useState } from "react";

export default function Teste() {
  const [valores, setValores] = useState<Record<string, string>>({});

  return (
    <div className="p-8">
      <div className="mt-8">
        <label>Input teste puro:</label>
        <input
          value={valores['teste'] ?? ""}
          onChange={e => {
            console.log("onChange input TESTE PURO", e.target.value)
            setValores(v => ({ ...v, teste: e.target.value }))
          }}
          placeholder="Teste digite vários dígitos"
          className="border p-2"
        />
      </div>
    </div>
  )
} 