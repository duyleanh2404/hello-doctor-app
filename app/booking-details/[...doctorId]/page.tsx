"use client";

import { useForm, SubmitHandler } from "react-hook-form";

import { BookingScheduleData } from "@/types/schedule-types";

import Breadcrumbs from "@/components/breadcrumbs";

import UserInfo from "./_components/user-info";
import ScheduleInfo from "./_components/schedule-info";

const BookingDetails = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<BookingScheduleData>({
    defaultValues: { new_patients: true }
  });

  const onSubmit: SubmitHandler<BookingScheduleData> = async (scheduleData) => {
    console.log(scheduleData);
  };

  return (
    <>
      <Breadcrumbs label="Doctor fullname" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="wrapper flex flex-col lg:flex-row gap-6 pt-8 pb-12 space-header-has-bottom"
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