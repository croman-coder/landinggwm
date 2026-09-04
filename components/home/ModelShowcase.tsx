import { modelos } from "@/content/modelos";
import { ModeloDetalle } from "@/components/home/ModeloDetalle";

/** Los 3 modelos, uno debajo del otro, alternando el lado de la imagen. */
export function ModelShowcase() {
  return (
    <div>
      {modelos.map((modelo, i) => (
        <ModeloDetalle key={modelo.slug} modelo={modelo} invertido={i % 2 === 1} />
      ))}
    </div>
  );
}
