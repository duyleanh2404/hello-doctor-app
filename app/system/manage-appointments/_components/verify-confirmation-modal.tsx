import { cn } from "@/lib/utils";
import { useState } from "react";

import { FiUpload } from "react-icons/fi";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { createHistory } from "@/services/history-service";

import { CreateHistoryForm } from "@/types/history-types";
import { AppointmentData } from "@/types/appointment-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/spinner";

interface VerifyConfirmationModalProps {
  isOpen: boolean;
  appointmentToVerify: AppointmentData;
  onClose: () => void;
  onChanged: () => void;
};

const VerifyConfirmationModal = ({
  isOpen, appointmentToVerify, onClose, onChanged
}: VerifyConfirmationModalProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateHistoryForm>();

  const handleVerifyAppointment: SubmitHandler<CreateHistoryForm> = async (data) => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    setLoading(true);

    try {
      await createHistory(
        accessToken,
        {
          ...data,
          appointment_id: appointmentToVerify._id,
          email: appointmentToVerify.user_id.email,
          prescriptionImage: data.prescriptionImage?.[0]
        }
      );
      toast.success("Xác nhận đơn đặt lịch khám thành công!");
      onChanged();
    } catch (error: any) {
      toast.error("Xác nhận đơn đặt lịch thất bại. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files?.[0];
      setFileName(file.name);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
    setFileName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] h-[95vh] flex flex-col gap-6">
        <div className="flex flex-col gap-4 p-1 pr-4">
          <DialogTitle className="text-xl">Đánh giá tình trạng sức khỏe của bệnh nhân</DialogTitle>
          <DialogDescription className="text-base">
            Xin vui lòng điền đánh giá về tình trạng sức khỏe của bệnh nhân sau khi khám. Các thông tin này sẽ giúp chúng tôi theo dõi quá trình điều trị và cải thiện sức khỏe cho bệnh nhân.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleVerifyAppointment)}
          className="flex-1 flex flex-col justify-between overflow-auto"
        >
          <div className={cn(
            "flex flex-col gap-4 p-1 pr-4 overflow-y-auto",
            errors.doctorComment || errors.healthStatus || errors.prescriptionImage ? "h-[75%]" : "h-auto"
          )}>
            <div className="flex flex-col gap-2">
              <Label className="text-base font-semibold">Đánh giá của bác sĩ:</Label>
              <Textarea
                spellCheck={false}
                placeholder="Vui lòng điền đánh giá tình trạng sức khỏe của bệnh nhân"
                {...register("doctorComment", { required: "Vui lòng điền đánh giá tình trạng sức khỏe!" })}
                className={cn(
                  "w-full h-40 p-3 outline-none border focus:border-primary focus:shadow-input-primary rounded-md transition duration-500",
                  errors.doctorComment ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.doctorComment && (
                <p className="text-red-500 text-sm">{errors.doctorComment.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Label className="text-base font-semibold">Tình trạng sức khỏe:</Label>
              <div className="flex items-center gap-12 mt-2">
                <div className="flex items-center cursor-pointer select-none">
                  <Input
                    type="radio"
                    id="bad"
                    value="bad"
                    {...register("healthStatus", { required: "Vui lòng chọn tình trạng sức khỏe!" })}
                    className="w-[18px] h-[18px] cursor-pointer"
                  />
                  <Label htmlFor="bad" className="pl-2 cursor-pointer">Xấu</Label>
                </div>

                <div className="flex items-center cursor-pointer select-none">
                  <Input
                    type="radio"
                    id="normal"
                    value="normal"
                    {...register("healthStatus", { required: "Vui lòng chọn tình trạng sức khỏe!" })}
                    className="w-[18px] h-[18px] cursor-pointer"
                  />
                  <Label htmlFor="normal" className="pl-2 cursor-pointer">Bình thường</Label>
                </div>

                <div className="flex items-center cursor-pointer select-none">
                  <Input
                    type="radio"
                    id="good"
                    value="good"
                    {...register("healthStatus", { required: "Vui lòng chọn tình trạng sức khỏe!" })}
                    className="w-[18px] h-[18px] cursor-pointer"
                  />
                  <Label htmlFor="good" className="pl-2 cursor-pointer">Tốt</Label>
                </div>
              </div>
              {errors.healthStatus && (
                <p className="text-red-500 text-sm">{errors.healthStatus.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Label className="block text-base font-semibold">Đơn thuốc:</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  {...register("prescriptionImage", { required: "Vui lòng tải ảnh đơn thuốc!" })}
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  type="button"
                  size="lg"
                  variant="upload"
                  className={cn(errors.prescriptionImage ? "border-red-500" : "border-gray-300")}
                >
                  <FiUpload size="18" />
                  <p>{fileName ? fileName : "Tải ảnh lên"}</p>
                </Button>
              </div>
              {errors.prescriptionImage && (
                <p className="text-red-500 text-sm">{errors.prescriptionImage.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              size="lg"
              variant="cancel"
              onClick={handleClose}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              size="lg"
              variant="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang xác nhận..." : "Xác nhận"}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="fixed inset-0">
            <Spinner center />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerifyConfirmationModal;