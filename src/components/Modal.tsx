import { X } from 'lucide-react'
import type { ReactNode } from 'react'
interface ModalProps { title: string; children: ReactNode; onClose: () => void }
export function Modal({ title, children, onClose }: ModalProps) {
  return <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-label={title}><button className="modal-close" aria-label="Cerrar" onClick={onClose}><X /></button><h2>{title}</h2><div className="modal-content">{children}</div></section></div>
}
