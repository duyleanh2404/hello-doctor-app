import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationModal = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm
}: DeleteConfirmationModalProps) => {
  return (
    // Dialog component to show the modal
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* Title of the modal */}
        <DialogTitle className="text-xl">Xác nhận xóa</DialogTitle>
        {/* Description of the action being confirmed */}
        <DialogDescription className="text-base">
          Bạn có chắc chắn muốn xóa chuyên khoa này? Hành động này không thể hoàn tác.
        </DialogDescription>
        <div className="flex justify-end gap-4">
          {/* Cancel button to close the modal */}
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-w-[100px] shadow-md transition duration-500"
          >
            Hủy
          </Button>

          {/* Confirm button to proceed with deletion */}
          <Button
            type="button"
            variant="default"
            disabled={isDeleting}
            onClick={onConfirm}
            className={cn(
              "min-w-[100px] bg-red-500 hover:bg-red-500/80 shadow-md transition duration-500",
              isDeleting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;