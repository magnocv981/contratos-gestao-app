// src/components/ComentariosContrato.jsx

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatarData } from "../utils/formatUtils";

export default function ComentariosContrato({ contratoId }) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    async function carregarComentarios() {
      const { data, error } = await supabase
        .from("historico_comentarios")
        .select("*")
        .eq("contrato_id", contratoId)
        .order("created_at", { ascending: false });

      if (!error) {
        setComentarios(data);
      }
    }

    if (contratoId) {
      carregarComentarios();
    }
  }, [contratoId]);

  if (!comentarios.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h2 className="text-lg font-semibold text-blue-800 mb-3">Histórico de Comentários</h2>
      <ul className="space-y-2 text-sm">
        {comentarios.map((c) => (
          <li
            key={c.id}
            className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded-md"
          >
            <div className="text-gray-700">{c.comentario}</div>
            <div className="text-gray-500 text-xs">{formatarData(c.created_at)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
