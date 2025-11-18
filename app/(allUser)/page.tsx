import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";
import CourseCard from "@/components/common/home/courses/CourseCard";
import CourseMap from "@/components/common/home/courses/CourseMap";
// import Courses from "@/components/common/home/courses/CourseCard";
import Cta from "@/components/common/home/cta/Cta";
import FaqSection from "@/components/common/home/faqSection/FaqSection";
import Review from "@/components/common/home/review/Review";

const page = () => {
  return (
    <div>
      <div>
        <ChoosePeerPath />
      </div>
      <div>
        <CourseMap />
      </div>
      <div>
        <Review />
      </div>
      <div className="p-20 pt-30">
        <Cta />
      </div>
      <div>
        <FaqSection />
      </div>
    </div>
  );
};

export default page;
