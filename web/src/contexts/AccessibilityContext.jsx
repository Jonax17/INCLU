import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

const defaultProfile = {
  fontSizeSlider: 1.0,
  highContrast: false,
  invertColors: false,
  darkMode: false,
  voiceEnabled: true,
  hapticIntensity: 0.5,
  hapticDuration: 100,
  emergencyContact: '',
};

// Slider 0.5 = 0.8x, slider 1.0 = 1.3x, slider 1.5 = 1.8x, slider 2.0 = 2.3x
function sliderToMultiplier(slider) {
  return slider + 0.3;
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('inclu-accessibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSizeMultiplier !== undefined && parsed.fontSizeSlider === undefined) {
          parsed.fontSizeSlider = Math.max(0.5, Math.min(2.0, parsed.fontSizeMultiplier - 0.3));
          delete parsed.fontSizeMultiplier;
        }
        return { ...defaultProfile, ...parsed };
      }
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem('inclu-accessibility', JSON.stringify(settings));
  }, [settings]);

  const fontSizeMultiplier = sliderToMultiplier(settings.fontSizeSlider);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, fontSizeMultiplier }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
