const successSound = new Audio("../../../public/success.mp3");

export const playSuccessSound = () => {
  successSound.currentTime = 0; // Reset the sound to start
  successSound.volume = 0.2; // Set volume to 20%
  successSound.play().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to play success sound", error);
  });
};
