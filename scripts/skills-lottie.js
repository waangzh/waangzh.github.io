document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("skillsLottie");
  if (!mount || !window.lottie) return;

  try {
    const response = await fetch("assets/skills-animation.json");
    if (!response.ok) return;

    const animationData = await response.json();

    window.lottie.loadAnimation({
      container: mount,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet"
      }
    });
  } catch (error) {
    console.error("Failed to load skills lottie animation.", error);
  }
});
