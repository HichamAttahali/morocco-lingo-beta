import { UserData } from '../types';

// Son pour les feedbacks
export const playSound = (type: 'correct' | 'incorrect' | 'click') => {
  // Création d'un AudioContext pour générer des sons
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  if (type === 'correct') {
    // Son de succès (notes ascendantes)
    playTone(audioContext, 523.25, 0.1); // Do
    setTimeout(() => playTone(audioContext, 659.25, 0.1), 100); // Mi
    setTimeout(() => playTone(audioContext, 783.99, 0.2), 200); // Sol
  } else if (type === 'incorrect') {
    // Son d'erreur (notes descendantes)
    playTone(audioContext, 440, 0.2); // La
    setTimeout(() => playTone(audioContext, 369.99, 0.3), 150); // Fa#
  } else if (type === 'click') {
    // Son de clic simple
    playTone(audioContext, 800, 0.1);
  }
};

const playTone = (audioContext: AudioContext, frequency: number, duration: number) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Sauvegarde des données utilisateur
export const saveUserData = (username: string, data: UserData): void => {
  try {
    localStorage.setItem(`morocco_lingo_${username}`, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

// Chargement des données utilisateur
export const loadUserData = (username: string): UserData | null => {
  try {
    const saved = localStorage.getItem(`morocco_lingo_${username}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  }
  return null;
};

// Réinitialisation des données utilisateur
export const resetUserData = (username: string): void => {
  try {
    localStorage.removeItem(`morocco_lingo_${username}`);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
  }
};

// Sauvegarde des paramètres globaux
export const saveSettings = (settings: any): void => {
  try {
    localStorage.setItem('morocco_lingo_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des paramètres:', error);
  }
};

// Chargement des paramètres globaux
export const loadSettings = (): any => {
  try {
    const saved = localStorage.getItem('morocco_lingo_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
  }
  return null;
};