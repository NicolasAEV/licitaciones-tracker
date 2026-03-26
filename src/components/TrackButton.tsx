"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function TrackButton({
  tenderCode,
  initialTracked = false,
  variant = "icon",
}: Readonly<{
  tenderCode: string;
  initialTracked?: boolean;
  variant?: "icon" | "button";
}>) {
  const [isTracked, setIsTracked] = useState(initialTracked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar estado actual si no se proporcionó initialTracked
    if (!initialTracked) {
      fetch(`/api/tracked-tenders/${encodeURIComponent(tenderCode)}`)
        .then((res) => res.json())
        .then((data) => setIsTracked(data.tracked))
        .catch(() => {});
    }
  }, [tenderCode, initialTracked]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      if (isTracked) {
        // Dejar de seguir
        const response = await fetch("/api/tracked-tenders", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tenderCode }),
        });

        if (!response.ok) throw new Error();
        setIsTracked(false);
      } else {
        // Empezar a seguir
        const response = await fetch("/api/tracked-tenders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tenderCode }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al marcar licitación");
        }
        setIsTracked(true);
      }
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar seguimiento";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="text-lg hover:scale-110 transition-transform disabled:opacity-50"
        title={isTracked ? "Dejar de seguir" : "Seguir licitación"}
      >
        {loading ? "⏳" : isTracked ? "⭐" : "☆"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
        isTracked
          ? "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      {loading ? "..." : isTracked ? "⭐ En seguimiento" : "☆ Seguir"}
    </button>
  );
}
