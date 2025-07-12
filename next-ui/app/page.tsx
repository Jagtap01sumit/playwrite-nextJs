import Header from "./componenets/Header";
import Footer from "./componenets/Footer";
import InputSection from "./componenets/InputSection";
export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <InputSection />
      <Footer />
    </div>
  );
}
