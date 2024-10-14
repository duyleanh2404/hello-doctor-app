"use client";

import { useForm, SubmitHandler } from "react-hook-form";

import { BookingScheduleData } from "@/types/schedule-types";

import UserInfo from "./_components/user-info";
import Breadcrumb from "@/components/breadcrumb";
import ScheduleInfo from "./_components/schedule-info";

const BookingDetails = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<BookingScheduleData>({
    defaultValues: { new_patients: true }
  });

  const handleBookingAppointment: SubmitHandler<BookingScheduleData> = async (scheduleData) => {
    console.log(scheduleData);
  };

  return (
    <>
      <Breadcrumb label="Doctor fullname" />

      <form
        onSubmit={handleSubmit(handleBookingAppointment)}
        className="wrapper flex flex-col lg:flex-row gap-6 pt-8 pb-12"
      >
        <UserInfo
          errors={errors}
          control={control}
          register={register}
        />

        <ScheduleInfo />
      </form>
    </>
  );
};

export default BookingDetails;