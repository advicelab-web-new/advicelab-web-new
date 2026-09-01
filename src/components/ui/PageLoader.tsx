const PageLoader = () => {
  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center gap-6">
      {/* Animated logo mark */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          {/* Outer spinning ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-primary-foreground/20 border-t-primary-foreground animate-spin"
            style={{ animationDuration: "1s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/og-image.webp"
              alt="Advice Lab"
              className="w-8 h-8 object-contain"
            />
          </div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary-foreground/80 animate-pulse" />
          </div>
        </div>

        {/* Wordmark */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-white text-base font-display font-semibold tracking-widest uppercase">
            Advice Lab
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
