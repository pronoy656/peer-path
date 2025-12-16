import { AlumniSections } from "@/components/common/home/alumni-section/AlumniSections";
import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";

import CourseMap from "@/components/common/home/courses/CourseMap";

import Cta from "@/components/common/home/cta/Cta";
import FaqSection from "@/components/common/home/faqSection/FaqSection";
import HeroSection from "@/components/common/home/heroSection/HeroSection";
import Review from "@/components/common/home/review/Review";

const page = () => {
  return (
    <div>
      <div>
        <HeroSection />
      </div>
      <div>
        <ChoosePeerPath />
      </div>
      <div>
        <CourseMap />
      </div>
      <div>
        <Review />
      </div>
      <div>
        <AlumniSections />
      </div>
      <div>
        <FaqSection />
      </div>
      <div className="p-20 pt-10">
        <Cta />
      </div>
    </div>
  );
};

export default page;
