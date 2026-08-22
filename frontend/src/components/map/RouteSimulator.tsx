import { useState, useEffect } from 'react';
import { Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { calculateDistanceKM } from '../../lib/utils';
import { motion } from 'framer-motion';

const SIMULATION_SPEED = 1000; // ms per step

interface RouteSimulatorProps {
  route: [number, number][];
  isActive: boolean;
  onClose: () => void;
}

export function RouteSimulator({ route, isActive, onClose }: RouteSimulatorProps) {
  const map = useMap();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  // Focus map on route when activated
  useEffect(() => {
    if (isActive && route.length > 0) {
      const bounds = L.latLngBounds(route.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [isActive, route, map]);

  // Simulation tick
  useEffect(() => {
    if (!isPlaying || currentIndex >= route.length - 1) {
      if (currentIndex >= route.length - 1) setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        
        // Calculate incremental distance
        const p1 = route[prev];
        const p2 = route[next];
        const dist = calculateDistanceKM(p1[0], p1[1], p2[0], p2[1]);
        setDistanceKm(d => d + dist);
        
        // Pan map smoothly to new point
        map.panTo(L.latLng(p2[0], p2[1]), { animate: true, duration: 1 });
        
        return next;
      });
    }, SIMULATION_SPEED);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, route, map]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setDistanceKm(0);
    if (route.length > 0) {
      map.panTo(L.latLng(route[0][0], route[0][1]));
    }
  };

  if (!isActive || route.length === 0) return null;

  const traversedRoute = route.slice(0, currentIndex + 1);
  const currentPos = route[currentIndex];

  const motoIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 38px; height: 38px; border-radius: 50%;
      background: #12121a; border: 2px solid #6366f1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      padding: 4px;
    ">
      <img src="/favicon.svg" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  return (
    <>
      <Polyline positions={traversedRoute} color="#6366f1" weight={5} dashArray="10, 10" className="animate-pulse" />
      <Marker position={currentPos} icon={motoIcon} />
      
      {/* HUD Control Panel over the map */}
      <div className="absolute top-4 right-4 z-[1000]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4 min-w-[220px]"
        >
          <div className="text-center w-full">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simulação de Rota</h3>
            <div className="text-4xl font-black text-indigo-400 tabular-nums tracking-tight font-mono">
              {distanceKm.toFixed(2)} <span className="text-sm font-bold text-indigo-500/50">KM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full justify-center border-t border-slate-700/50 pt-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-gradient-to-tr from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              title={isPlaying ? "Pausar" : "Iniciar Rota"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <button 
              onClick={handleReset}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
              title="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>

            <button 
              onClick={() => { handleReset(); onClose(); }}
              className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all ml-auto"
              title="Sair da Simulação"
            >
              <Square size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
