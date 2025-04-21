
/**
 * Play a sound effect
 * @param soundName The name of the sound file without extension
 */
export const playSound = (soundName: string) => {
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error(`Error playing sound ${soundName}:`, error);
    });
  } catch (error) {
    console.error(`Error setting up audio ${soundName}:`, error);
  }
};

/**
 * Play a looping sound effect
 * @param soundName The name of the sound file without extension
 * @returns Audio object that can be stopped later
 */
export const playLoopingSound = (soundName: string): HTMLAudioElement => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.loop = true;
  audio.volume = 0.3;
  audio.play().catch(console.error);
  return audio;
};

