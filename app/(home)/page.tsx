"use client";

import Hero from "./hero";
import Categories from "./categories";
import NewPosts from "./new-posts";
import PopularSpecialities from "./popular-specialties";
import SpecialistArticle from "./specialist-article";
import BodyMassIndex from "./body-mass-index";
import HealthCheckTools from "./health-check-tools";
import Introduces from "./introduces";
import TeamOfExperts from "./team-of-experts";

export default function Home() {
  return (
    <main>
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
    </main>
  );
}
