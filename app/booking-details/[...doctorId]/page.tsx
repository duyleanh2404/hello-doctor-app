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
    defaultValues: { new_patients: true } // Setting default values for the form
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<BookingScheduleData> = async (scheduleData) => {
    console.log(scheduleData); // Log the submitted data to the console (can be replaced with API calls)
  };

  return (
    <>
      {/* Breadcrumb for navigation */}
      <Breadcrumb label="Doctor fullname" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="wrapper flex flex-col lg:flex-row gap-6 pt-8 pb-12"
      >
        {/* Rendering UserInfo component for collecting user details */}
        <UserInfo
          errors={errors}
          control={control}
          register={register}
        />

        {/* Rendering ScheduleInfo component for collecting schedule details */}
        <ScheduleInfo />
      </form>
    </>
  );
};

export default BookingDetails;