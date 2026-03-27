import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
        <Image
          src="/assets/logo-dark.png"
          alt="Onlink Davao"
          width={200}
          height={67}
          priority
          className="mb-4"
        />
        <h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight"
          style={{ color: "#151E2C" }}
        >
          Your Link to{" "}
          <span style={{ color: "#4288C4" }}>Davao</span>
        </h1>
        <p className="text-lg max-w-xl leading-relaxed" style={{ color: "#64748b" }}>
          Discover events, connect with the community, and stay updated on
          everything happening in Davao City.
        </p>
        <a
          href="#calendar"
          className="mt-2 px-8 py-3 rounded-full font-semibold text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: "#4288C4" }}
        >
          Browse Events
        </a>
      </div>

      <div className="absolute bottom-10 flex gap-3 items-center">
        <span
          className="block w-3 h-3 rounded-full"
          style={{ backgroundColor: "#4288C4" }}
        />
        <span
          className="block w-3 h-3 rounded-full"
          style={{ backgroundColor: "#EF3D51" }}
        />
        <span
          className="block w-3 h-3 rounded-full"
          style={{ backgroundColor: "#FBAE0E" }}
        />
      </div>
    </section>
  );
}
