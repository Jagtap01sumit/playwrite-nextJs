import Header from "./componenets/Header";
import Footer from "./componenets/Footer";
import InputSection from "./componenets/InputSection";
import HealthInfoSection from "./componenets/InfoSection";
export default function Home() {
  return (
    <div className="flex flex-col px-5 ">
      <Header />
      <InputSection />
      <HealthInfoSection />
      <Footer />
    </div>
  );
}
