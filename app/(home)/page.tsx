"use client";

import { useState, useEffect, lazy } from "react";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import Hero from "./_components/hero";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";
import Categories from "./_components/categories";
import LazyLoadComponent from "@/components/lazyload-component";

const NewPosts = lazy(() => import("./_components/new-posts"));
const Introduces = lazy(() => import("./_components/introduces"));
const CentralPoints = lazy(() => import("./_components/central-points"));
const TeamOfExperts = lazy(() => import("./_components/team-of-experts"));
const BodyMassIndex = lazy(() => import("./body-mass-index/body-mass-index"));
const HealthCheckTools = lazy(() => import("./_components/health-check-tools"));
const SpecialistArticle = lazy(() => import("./_components/specialist-article"));
const PopularSpecialities = lazy(() => import("./_components/popular-specialties"));
const ModalAdvertise = lazy(() => import("@/components/advertises/modal-advertise"));

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    NProgress.done();
    const shouldShowModal = Math.random() > 0.2;
    setShowModal(shouldShowModal);
  }, []);

  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <NewPosts />
      <PopularSpecialities />
      <CentralPoints />
      <LazyLoadComponent>
        <div id="health-check" className="xl:wrapper flex flex-col xl:flex-row gap-16 py-12">
          <SpecialistArticle />
          <div className="flex-1 flex flex-col gap-12">
            <BodyMassIndex />
            <HealthCheckTools />
          </div>
        </div>
      </LazyLoadComponent>
      <Introduces />
      <TeamOfExperts />
      {showModal && <ModalAdvertise />}
      <Footer />
      <Chatbot />
    </main>
  );
};