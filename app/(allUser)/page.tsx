import { AlumniSections } from "@/components/common/home/alumni-section/AlumniSections";
import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";
import CourseMap from "@/components/common/home/courses/CourseMap";
import Cta from "@/components/common/home/cta/Cta";
import FaqSection from "@/components/common/home/faqSection/FaqSection";
import HeroSection from "@/components/common/home/heroSection/HeroSection";
import Review from "@/components/common/home/review/Review";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ChoosePeerPath />
      <CourseMap />
      <Review />
      <AlumniSections />
      <FaqSection />
      <div className="px-4 sm:px-8 lg:px-20 pb-20 pt-6">
        <Cta />
      </div>
    </div>
  );
}
