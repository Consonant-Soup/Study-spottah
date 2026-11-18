'use client';

import { ArrowUpRight, MapPin, ZoomIn } from 'lucide-react';
import { SOURCES, SHUTTLE_STOPS } from '@/lib/transit/data';
import type { TransitStop, Service } from '@/lib/transit/types';
import styles from './Transit.module.css';

type Props = {
  stops: TransitStop[];
  selectedStopId: string;
  onSelectStop: (id: string) => void;
  visibleService: 'all' | Service;
};

// Static illustrated campus guide. These are diagram coordinates, not
// road geometries or GPS positions. Source map is linked for verification.
export default function TransitMap({ stops, selectedStopId, onSelectStop, visibleService }: Props) {
  const selected = stops.find((item) => item.id === selectedStopId);
  const shuttlePath = SHUTTLE_STOPS.map((stop) => `${stop.x * 9},${stop.y * 5.6}`).join(' ');
  const showRainbow = visibleService === 'all' || visibleService === 'rainbow';
  const showTheBus = visibleService === 'all' || visibleService === 'thebus';

  return (
    <div className={styles.mapShell}>
      <div className={styles.mapToolbar}>
        <span className={styles.mapToolbarTitle}><MapPin size={15} /> MĀNOA CAMPUS GUIDE</span>
        <span className={styles.mapStatic}><ZoomIn size={13} /> ILLUSTRATIVE MAP</span>
      </div>
      <div className={styles.mapArt} role="group" aria-label="Illustrated UH Mānoa transit stop map">
        <svg className={styles.mapSvg} viewBox="0 0 900 560" role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="campusDots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#d3dfe5" /></pattern>
          </defs>
          <rect width="900" height="560" fill="#edf3ed" />
          <rect width="900" height="560" fill="url(#campusDots)" opacity=".6" />
          <path d="M0 438 L900 438 M105 0 L105 560 M720 0 L720 560 M50 108 L880 108 M516 0 L516 560 M0 298 L900 298" stroke="#fff" strokeWidth="30" fill="none" />
          <path d="M0 438 L900 438 M105 0 L105 560 M720 0 L720 560 M50 108 L880 108 M516 0 L516 560 M0 298 L900 298" stroke="#d6e0da" strokeWidth="2" strokeDasharray="4 7" fill="none" />
          <path d="M850 -20 C812 74 822 134 858 218 S882 442 800 580" stroke="#a4d8ee" strokeWidth="23" fill="none" opacity=".75" />
          <path d="M850 -20 C812 74 822 134 858 218 S882 442 800 580" stroke="#d9f6fc" strokeWidth="9" fill="none" opacity=".7" />
          <g fill="#dfe5dd" stroke="#cbd6cf" strokeWidth="1.5">
            <rect x="168" y="140" width="136" height="106" /><rect x="345" y="146" width="102" height="76" />
            <rect x="345" y="254" width="126" height="89" /><rect x="166" y="327" width="129" height="72" />
            <rect x="329" y="374" width="114" height="49" /><rect x="557" y="157" width="93" height="62" />
            <rect x="561" y="326" width="79" height="65" /><rect x="761" y="334" width="60" height="89" />
            <rect x="746" y="154" width="59" height="76" /><rect x="445" y="471" width="83" height="60" />
          </g>
          <g fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="1.3" fontWeight="700" fill="#000">
            <text x="181" y="199">CAMPUS CENTER</text><text x="354" y="188">HAMILTON</text>
            <text x="362" y="297">ACADEMIC</text><text x="180" y="366">SINCLAIR</text>
            <text x="570" y="191">ST. JOHN</text><text x="560" y="367">GATEWAY</text>
            <text x="448" y="492">LOWER</text><text x="448" y="506">CAMPUS</text>
          </g>
          <g fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#000">
            <text x="23" y="423" transform="rotate(-90 23 423)">UNIVERSITY AVE</text>
            <text x="273" y="455">DOLE STREET</text><text x="739" y="105">EAST-WEST ROAD</text>
            <text x="286" y="96">MAILE WAY</text><text x="341" y="285" opacity=".45">UH MĀNOA</text>
          </g>
          <g opacity=".28"><circle cx="290" cy="485" r="60" fill="#c4d6c2" /><circle cx="885" cy="84" r="92" fill="#a8cba8" /></g>
          {showRainbow && <>
            <polyline points={shuttlePath} fill="none" stroke="#fff" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" opacity=".9" />
            <polyline points={shuttlePath} fill="none" stroke="#7d9946" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="13 7" />
            <path d="M756 454 C700 440 692 412 666 407" stroke="#7d9946" strokeWidth="5" strokeDasharray="12 6" fill="none" />
          </>}
          {showTheBus && <>
            <path d="M72 515 L103 460 L125 407 L204 307 L222 290" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
            <path d="M72 515 L103 460 L125 407 L204 307 L222 290" fill="none" stroke="#91a8eb" strokeWidth="6" strokeLinecap="round" strokeDasharray="18 8" />
            <path d="M222 290 C270 325 430 440 620 407 L655 398" fill="none" stroke="#fff" strokeWidth="13" />
            <path d="M222 290 C270 325 430 440 620 407 L655 398" fill="none" stroke="#91a8eb" strokeWidth="6" strokeDasharray="18 8" />
          </>}
        </svg>
        <div className={styles.mapCornerLabel}>CAMPUS CENTER <span>↗</span> EAST-WEST CENTER</div>
        {stops.filter((stop) => visibleService === 'all' || stop.service === visibleService).map((stop) => (
          <button
            key={stop.id}
            type="button"
            className={`${styles.mapPin} ${stop.service === 'rainbow' ? styles.pinShuttle : styles.pinBus} ${selectedStopId === stop.id ? styles.pinActive : ''}`}
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            title={`${stop.name} — ${stop.service === 'thebus' ? 'TheBus' : 'Rainbow Shuttle'}`}
            aria-label={`Select ${stop.name} ${stop.service === 'thebus' ? 'TheBus' : 'Rainbow Shuttle'} stop`}
            aria-pressed={selectedStopId === stop.id}
            onClick={() => onSelectStop(stop.id)}
          >{stop.service === 'rainbow' ? 'S' : 'B'}</button>
        ))}
        <div className={styles.mapLegend}>
          <span><i className={styles.legendBus} /> TheBus</span>
          <span><i className={styles.legendShuttle} /> Rainbow Shuttle</span>
        </div>
      </div>
      <div className={styles.mapFooter}>
        <div className={styles.mapSelected}>
          <span className={styles.mapSelectedLabel}>SELECTED STOP</span>
          <strong>{selected?.name ?? 'Choose a stop'}</strong>
          <small>{selected?.subtitle ?? 'Select a marker above'} {selected?.stopId ? `· Stop #${selected.stopId}` : ''}</small>
        </div>
        <a href={SOURCES.officialMap} target="_blank" rel="noreferrer" className={styles.mapOfficial}>Official shuttle map <ArrowUpRight size={15} /></a>
      </div>
    </div>
  );
}
