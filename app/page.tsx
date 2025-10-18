import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import Step from "@/components/Step";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_45%,#b49cff_0%,#8b6ef7_45%,#7a5cf4_70%,#6a50e6_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          <div className="hero-grid grid min-h-[calc(100vh-64px)] place-items-center gap-8 md:grid-cols-2">
            <div className="w-full max-w-2xl md:w-[60vw] md:justify-self-auto">
              <h1 className="hero-title text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Turn your photo into a{" "}
                <span className="text-yellow-300">paint-by-numbers</span> canvas
              </h1>

              <p className="mt-4 text-lg text-white/85 md:text-xl">
                Minimal steps. Beautiful results. Made for everyone 🎨
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#how-it-works"
                  className="rounded-lg bg-white px-5 py-3 font-medium text-slate-900 shadow-sm hover:bg-white/90"
                >
                  How it works
                </a>
                <Link
                  href="/upload"
                  className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-slate-900 hover:bg-yellow-300"
                >
                  Try now
                </Link>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <div className="hero-slider w-[92%] max-w-[680px] rounded-2xl shadow-2xl md:w-[600px] lg:w-[660px]">
                <HeroSlider />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Step
        id="how-it-works"
        number={1}
        title="Try it now"
        text="Click the button and start — you can test the flow for free."
        imageLeft={false}
        imageSrc="/screen 1.png"
        cta={{ label: "Try now", href: "/upload", variant: "yellow" }}
      />

      <Step
        number={2}
        title="Upload your photo"
        text="Choose your image and adjust the parameters."
        imageLeft
        imageSrc="/screen 2.png"
      />

      <Step
        number={3}
        title="Pick palette & size"
        text="Select colors count, canvas size and level of detail."
        imageLeft={false}
        imageSrc="/screen 3.png"
      />

      <Step
        number={4}
        title="Preview the result"
        text="See the numbered layout and color legend. Add to cart if you like it."
        imageLeft
        imageSrc="/screen 4.png"
      />

      <Step
        number={5}
        title="Checkout & pay"
        text="Secure checkout — choose digital PDF kit or printed canvas."
        imageLeft={false}
        imageSrc="/screen 5.png"
      />

      <Testimonials />
    </>
  );
}
