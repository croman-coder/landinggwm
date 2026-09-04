import type { ReactNode } from "react";
import type { Modelo } from "@/content/modelos";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";

type Props = {
  /** Landing de un solo modelo: aísla Header y Footer de los otros 2. */
  modelo?: Modelo;
  children: ReactNode;
};

/**
 * Header + <main> + Footer, compartido por los dos grupos de rutas:
 * `(main)` (landing general) y `(modelo)` (una por QR). Vive acá y no en el
 * layout raíz porque cada grupo decide si pasa `modelo` — el raíz no tiene
 * forma de saberlo (un layout no recibe los `params` de un segmento hijo).
 */
export function PageChrome({ modelo, children }: Props) {
  return (
    <>
      <Header modoAislado={!!modelo} />
      <main className="flex-1" id="inicio">
        {children}
      </main>
      <Footer modelo={modelo} />
      <WhatsAppFAB modelo={modelo} />
    </>
  );
}
