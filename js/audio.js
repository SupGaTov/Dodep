
/**
 * Sound management
 */
const audioManager = {
  sounds: {
    'spin-loop': document.getElementById('spin-sound'),
    'win': document.getElementById('win-sound'),
    'big-win': document.getElementById('big-win-sound'),
    'stop': document.getElementById('stop-sound'),
    'jackpot': document.getElementById('jackpot-sound'),
    'card-deal': document.getElementById('card-deal-sound')
  },
  
  // Play a sound effect
  playSound(soundName) {
    try {
      const settings = gameStorage.getSoundSettings();
      
      if (!settings.enabled) return;
      
      const sound = this.sounds[soundName];
      if (!sound) {
        console.error(`Sound not found: ${soundName}`);
        return;
      }
      
      sound.volume = settings.volume / 100;
      sound.currentTime = 0;
      sound.loop = false;
      sound.play().catch(error => {
        console.error(`Error playing sound ${soundName}:`, error);
      });
    } catch (error) {
      console.error(`Error playing sound ${soundName}:`, error);
    }
  },
  
  // Play a looping sound
  playLoopingSound(soundName) {
    try {
      const settings = gameStorage.getSoundSettings();
      
      if (!settings.enabled) return null;
      
      const sound = this.sounds[soundName];
      if (!sound) {
        console.error(`Sound not found: ${soundName}`);
        return null;
      }
      
      sound.volume = settings.volume / 100;
      sound.currentTime = 0;
      sound.loop = true;
      
      sound.play().catch(error => {
        console.error(`Error playing looping sound ${soundName}:`, error);
      });
      
      return sound;
    } catch (error) {
      console.error(`Error starting looping sound ${soundName}:`, error);
      return null;
    }
  },
  
  // Stop a looping sound
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  },
  
  // Update all audio volumes
  updateVolumes(volume) {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.volume = volume / 100;
      }
    });
  }
};

// Initialize volume on page load
document.addEventListener('DOMContentLoaded', () => {
  const settings = gameStorage.getSoundSettings();
  audioManager.updateVolumes(settings.volume);
});
