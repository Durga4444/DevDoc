import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Fragment } from 'react'
import { X } from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmVariant = 'primary'
}) => {
  if (!isOpen) return null

  // Map confirmVariant to shadcn Button variants
  const getButtonVariant = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'destructive';
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button variant={getButtonVariant()} onClick={onConfirm} type="button">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal 