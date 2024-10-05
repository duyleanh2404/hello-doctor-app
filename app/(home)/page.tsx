"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";

import Hero from "./hero";
import NewPosts from "./new-posts";
import Introduces from "./introduces";
import Categories from "./categories";
import BodyMassIndex from "./body-mass-index";
import TeamOfExperts from "./team-of-experts";
import HealthCheckTools from "./health-check-tools";
import SpecialistArticle from "./specialist-article";
import PopularSpecialities from "./popular-specialties";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <NewPosts />
      <PopularSpecialities />
      <div className="xl:wrapper flex flex-col xl:flex-row gap-16 py-12">
        <SpecialistArticle />
        <div className="flex-1 flex flex-col gap-12">
          <BodyMassIndex />
          <HealthCheckTools />
        </div>
      </div>
      <Introduces />
      <TeamOfExperts />
      <Footer />
    </main>
  );
};