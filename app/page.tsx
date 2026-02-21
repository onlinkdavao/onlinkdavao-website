export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#151E2C" }}
    >
      <div className="mt-16 flex flex-col items-center gap-4 text-center px-6">
        <h1
          className="text-white text-4xl font-bold tracking-tight sm:text-5xl"
          style={{
            fontFamily:
              "'Google Sans Display', 'Google Sans', Arial, sans-serif",
          }}
        >
          Coming Soon
        </h1>
        <p className="text-lg max-w-md" style={{ color: "#8a9ab5" }}>
          We&apos;re working on something exciting for Davao.
          <br />
          Stay tuned!
        </p>
      </div>

      <div className="mt-12 flex gap-3 items-center">
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
    </main>
  );
}
