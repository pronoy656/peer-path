import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";
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
