import { X } from 'lucide-react'
import type { ReactNode } from 'react'
interface ModalProps { title: string; children: ReactNode; onClose: () => void }
export function Modal({ title, children, onClose }: ModalProps) {
  const isCelebration = title.includes('MUY BIEN')

  return <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label={title}><button className="modal-close" aria-label="Cerrar" onClick={onClose}><X /></button><h2 className={isCelebration ? 'celebration-title' : undefined}>{title}</h2><div className="modal-content">{children}</div></section></div>
}
