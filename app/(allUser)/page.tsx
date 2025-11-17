import ChoosePeerPath from "@/components/common/home/choose-peerpath/ChoosePeerPath";
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
    </div>
  );
};

export default page;
