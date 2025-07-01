import PromptForm from "@/components/PromptForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <div className="py-24 px-6">
        <PromptForm />
      </div>
      <Footer />
    </div>
  );
}