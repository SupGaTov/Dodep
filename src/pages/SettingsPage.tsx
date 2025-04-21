
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/Layout';
import { useGame } from '@/contexts/GameContext';
import { Volume2, VolumeX } from 'lucide-react';

const SettingsPage = () => {
  const { soundVolume, setSoundVolume, soundEnabled, setSoundEnabled } = useGame();
  
  const handleVolumeChange = (value: number[]) => {
    setSoundVolume(value[0]);
  };
  
  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Настройки</h1>
        
        <Card className="glass-panel mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-casino-gold text-2xl">Настройки звука</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-toggle" className="text-white text-lg">
                  Звук
                </Label>
                <Switch
                  id="sound-toggle"
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
              <p className="text-gray-400 text-sm">
                Включить или выключить все звуки в игре
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="volume-slider" className="text-white text-lg flex items-center">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 mr-2 text-casino-gold" />
                ) : (
                  <VolumeX className="w-5 h-5 mr-2 text-gray-500" />
                )}
                Громкость
              </Label>
              <Slider
                id="volume-slider"
                defaultValue={[soundVolume]}
                max={100}
                step={1}
                disabled={!soundEnabled}
                onValueChange={handleVolumeChange}
                className={soundEnabled ? "" : "opacity-50"}
              />
              <div className="flex justify-between text-gray-400 text-sm">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-casino-gold text-2xl">О приложении</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white">
              Lucky Slots - специальное приложение, созданное для Кирюхи в честь его дня рождения!
            </p>
            <p className="text-white">
              Наслаждайтесь разнообразными слотами и выигрывайте виртуальные деньги. Не забудьте про особый слот с поздравлением!
            </p>
            
            <div className="mt-6 text-center">
              <p className="text-casino-gold text-xl font-bold mb-2">С ДНЕМ РОЖДЕНИЯ, КИРЮХА!</p>
              <p className="text-white">Желаем удачи в игре и в жизни!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
