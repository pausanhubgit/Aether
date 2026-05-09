const CallToAction = () => {
  return (
    <section className="py-24 bg-primary dark:bg-purple-900/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDQwTDQwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiAvPgo8L3N2Zz4=')]"></div>
      <div className="container-7xl relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-semibold mb-4 text-white uppercase tracking-wider">
            Join Our{" "}
            <span className="text-secondary dark:text-white">Newsletter</span>
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-lg font-medium">
            Stay updated with the latest arrivals, exclusive collections, and
            community events directly in your inbox.
          </p>
        </div>
        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 flex-grow focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
            required
          />
          <button
            type="submit"
            className="bg-white text-primary px-10 py-4 rounded-2xl font-semibold uppercase text-sm tracking-widest hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default CallToAction;
