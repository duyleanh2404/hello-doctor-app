import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  isCancel?: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmationModal = ({
  isOpen, isDeleting, isCancel, onClose, onConfirm
}: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-xl">Xác nhận {isCancel ? "hủy" : "xóa"}?</DialogTitle>
        <DialogDescription className="text-base">
          {
            isCancel
              ? "Bạn có chắc chắn muốn hủy đơn? Hành động này không thể hoàn tác."
              : "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."
          }
        </DialogDescription>

        <div className="flex justify-end gap-4 mt-6">
          {!isCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[120px] h-[3.2rem] shadow-md transition duration-500"
            >
              Hủy
            </Button>
          )}

          <Button
            type="button"
            variant="default"
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-w-[120px] h-[3.2rem] bg-red-500 hover:bg-red-500/80 shadow-md transition duration-500"
          >
            {
              isCancel
                ? isDeleting ? "Đang hủy..." : "Hủy đơn"
                : isDeleting ? "Đang xóa..." : "Xóa"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;