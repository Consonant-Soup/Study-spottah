'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, BusFront, ChevronDown, Clock3, Compass, GraduationCap, Info, LocateFixed, MapPin, RefreshCw, Route, Search, X } from 'lucide-react';
import TransitMap from './TransitMap';
import { ALL_STOPS, ROUTE_DETAILS, SHUTTLE_STOPS, SOURCES, THEBUS_STOPS } from '@/lib/transit/data';
import { getDemoBusArrivals, getHonoluluClock, getNextRainbowDepartures } from '@/lib/transit/schedule';
import type { Arrival, Direction, HeaApiResponse, Service } from '@/lib/transit/types';
import styles from './Transit.module.css';

const LIVE_ENABLED = process.env.NEXT_PUBLIC_TRANSIT_LIVE_ENABLED === 'true';
const LIVE_STOP_IDS = ['983', '3674', '4550', '413', '297'];

function ModePill({ live }: { live: boolean }) {
  return <span className={`${styles.modePill} ${live ? styles.modeLive : ''}`}><span className={styles.modeDot} />{live ? 'HEA CONNECTED' : 'PREVIEW MODE'}</span>;
}

function RouteBadge({ value, shuttle = false }: { value: string; shuttle?: boolean }) {
  return <span className={`${styles.routeBadge} ${shuttle ? styles.routeBadgeShuttle : ''}`}>{value}</span>;
}

function ArrivalRow({ arrival }: { arrival: Arrival }) {
  return <div className={styles.arrivalRow}>
    <RouteBadge value={arrival.routeLabel} shuttle={arrival.service === 'rainbow'} />
    <div className={styles.arrivalDetails}>
      <strong>{arrival.headsign}</strong>
      <small><MapPin size={12} /> {arrival.stopName}</small>
    </div>
    <div className={styles.arrivalTiming}>
      <strong>{arrival.minutes === 0 ? 'Now' : `${arrival.minutes} min`}</strong>
      <small>{arrival.timeLabel}</small>
    </div>
  </div>;
}

function NextArrivals({ now, selectedStopId, onRefresh }: { now: Date; selectedStopId: string; onRefresh: () => void }) {
  const [direction, setDirection] = useState<Direction>('incoming');
  const [liveArrivals, setLiveArrivals] = useState<Arrival[]>([]);
  const [liveMode, setLiveMode] = useState<'demo' | 'live' | 'unavailable'>(LIVE_ENABLED ? 'unavailable' : 'demo');
  const [loading, setLoading] = useState(LIVE_ENABLED);
  const [refreshKey, setRefreshKey] = useState(0);

  // Future Tier 2: the browser calls only our own Next.js API route, never HEA
  // directly. That route keeps the AppID in the server environment.
  useEffect(() => {
    if (!LIVE_ENABLED) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const payloads = await Promise.all(LIVE_STOP_IDS.map(async (stop) => {
          const response = await fetch(`/api/transit/thebus?stop=${stop}`, { cache: 'no-store' });
          if (!response.ok) throw new Error('Provider unavailable');
          return response.json() as Promise<HeaApiResponse>;
        }));
        if (cancelled) return;
        if (payloads.every((item) => item.mode === 'live')) {
          setLiveMode('live');
          setLiveArrivals(payloads.flatMap((item) => item.arrivals).sort((a, b) => a.minutes - b.minutes));
        } else {
          setLiveMode('unavailable');
          setLiveArrivals([]);
        }
      } catch {
        if (!cancelled) {
          setLiveMode('unavailable');
          setLiveArrivals([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    const interval = setInterval(() => { void load(); }, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [refreshKey]);

  const selectedTheBus = THEBUS_STOPS.find((item) => item.id === selectedStopId);
  const arrivals = liveMode === 'demo' ? getDemoBusArrivals(THEBUS_STOPS, now) : liveArrivals;
  const displayed = arrivals
    .filter((item) => item.direction === direction)
    .filter((item) => !selectedTheBus || item.stopId === selectedStopId)
    .slice(0, 4);

  return <section className={styles.board} aria-label="Next transit options">
    <div className={styles.boardTop}>
      <div><span className={styles.eyebrow}>UP NEXT</span><h2>Next arrivals</h2></div>
      <button title="Refresh arrivals" className={styles.refreshBtn} onClick={() => { onRefresh(); setRefreshKey((n) => n + 1); }}><RefreshCw size={18} /></button>
    </div>
    <div className={styles.boardMode}><ModePill live={liveMode === 'live'} /> <span>{liveMode === 'demo' ? 'TheBus times below are fictional samples' : liveMode === 'unavailable' ? 'Live feed is unavailable' : 'Powered by TheBus HEA'}</span></div>
    <div className={styles.directionTabs} role="tablist" aria-label="Travel direction">
      <button className={direction === 'incoming' ? styles.tabActive : ''} onClick={() => setDirection('incoming')} role="tab" aria-selected={direction === 'incoming'}><ArrowDownLeft size={15} /> To campus</button>
      <button className={direction === 'outgoing' ? styles.tabActive : ''} onClick={() => setDirection('outgoing')} role="tab" aria-selected={direction === 'outgoing'}><ArrowUpRight size={15} /> From campus</button>
    </div>
    <div className={styles.arrivalRows}>
      {loading ? <div className={styles.emptyBoard}><RefreshCw size={21} /> Checking TheBus feed…</div>
        : displayed.length ? displayed.map((arrival) => <ArrivalRow key={arrival.id} arrival={arrival} />)
          : <div className={styles.emptyBoard}><BusFront size={22} /><strong>No times to show</strong><span>{liveMode === 'unavailable' ? 'Verify the HEA API key and provider availability.' : selectedTheBus ? 'Choose another stop to see sample rides.' : 'Check the official TheBus timetable.'}</span></div>}
    </div>
    <div className={styles.boardBottom}>
      <Info size={14} /> {liveMode === 'demo' ? 'Preview only — not actual bus ETAs.' : liveMode === 'live' ? 'Estimates and scheduled arrivals can change.' : 'No live fallback is shown as verified.'}
      <a href={SOURCES.theBusHea} target="_blank" rel="noreferrer">Check HEA <ArrowUpRight size={14} /></a>
    </div>
  </section>;
}

function ShuttleCard({ now, selectedStopId, onSelectStop }: { now: Date; selectedStopId: string; onSelectStop: (id: string) => void }) {
  const selected = SHUTTLE_STOPS.find((item) => item.id === selectedStopId) ?? SHUTTLE_STOPS[0];
  const next = getNextRainbowDepartures(selected, now, 3);
  return <section className={styles.shuttleCard}>
    <div className={styles.shuttleHeader}>
      <span className={styles.shuttleIcon}><BusFront size={21} strokeWidth={2.2}/></span>
      <div><span className={styles.eyebrow}>AROUND CAMPUS</span><h3>Rainbow Shuttle</h3></div>
      <span className={styles.freeTag}>FREE WITH UH ID</span>
    </div>
    <div className={styles.shuttleControls}>
      <label htmlFor="shuttle-stop">BOARDING AT</label>
      <div className={styles.selectWrap}>
        <select id="shuttle-stop" value={selected.id} onChange={(event) => onSelectStop(event.target.value)}>
          {SHUTTLE_STOPS.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
        </select><ChevronDown size={16} />
      </div>
    </div>
    <div className={styles.shuttleTimes}>
      {next.length ? next.map((arrival) => <div className={styles.shuttleTime} key={arrival.id}>
        <div><strong>{arrival.timeLabel}</strong><span>Published schedule</span></div>
        <strong className={styles.shuttleMinutes}>{arrival.minutes === 0 ? 'NOW' : `${arrival.minutes} MIN`}</strong>
      </div>) : <div className={styles.shuttleOff}><Clock3 size={19}/><div><strong>No more scheduled shuttles today</strong><span>Weekdays during fall & spring semesters only. No holidays.</span></div></div>}
    </div>
    <div className={styles.shuttleNote}><Clock3 size={14} /> 7:00 AM–5:00 PM · 30-minute loop · not live tracking</div>
    <a className={styles.shuttleLink} href={SOURCES.rainbowSchedule} target="_blank" rel="noreferrer">Official schedule & route <ArrowUpRight size={16} /></a>
  </section>;
}

function StopDirectory({ selectedStopId, onSelectStop, filter, setFilter }: {
  selectedStopId: string;
  onSelectStop: (id: string) => void;
  filter: 'all' | Service;
  setFilter: (filter: 'all' | Service) => void;
}) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const filtered = ALL_STOPS.filter((stop) => (filter === 'all' || filter === stop.service) && `${stop.name} ${stop.subtitle} ${stop.stopId ?? ''}`.toLowerCase().includes(search.toLowerCase()));
  const shown = expanded || search ? filtered : filtered.slice(0, 8);

  return <section className={styles.directory} id="stops">
    <div className={styles.sectionHeading}>
      <div><span className={styles.eyebrow}>KNOW YOUR STOP</span><h2>Find your boarding spot<span className={styles.titleStar}>.</span></h2><p>Tap a stop to highlight it on the map. Bus numbers are official; marker placement is schematic.</p></div>
      <div className={styles.searchBox}><Search size={18}/><input aria-label="Search transit stops" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stops or stop #" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={16}/></button>}</div>
    </div>
    <div className={styles.filters} role="group" aria-label="Filter stop service">
      {([['all','All stops'], ['thebus','TheBus'], ['rainbow','Rainbow Shuttle']] as const).map(([value, title]) => <button key={value} className={filter === value ? styles.filterActive : ''} onClick={() => { setFilter(value); setExpanded(false); }}>{title}{value === 'all' ? ` ${ALL_STOPS.length}` : value === 'thebus' ? ` ${THEBUS_STOPS.length}` : ` ${SHUTTLE_STOPS.length}`}</button>)}
    </div>
    <div className={styles.stopGrid}>
      {shown.map((stop) => <button key={stop.id} onClick={() => onSelectStop(stop.id)} className={`${styles.stopCard} ${selectedStopId === stop.id ? styles.stopCardActive : ''}`}>
        <span className={`${styles.stopCardSymbol} ${stop.service === 'rainbow' ? styles.stopSymbolShuttle : ''}`}><MapPin size={18}/></span>
        <span className={styles.stopCardText}><strong>{stop.name}</strong><small>{stop.subtitle}</small><span className={styles.stopTags}>{stop.routes.map((route) => <em key={route}>{ROUTE_DETAILS[route].name}</em>)}{stop.side === 'nearby' && <em>Nearby</em>}</span></span>
        <span className={styles.stopCardAside}>{stop.stopId && <small>#{stop.stopId}</small>}<ArrowUpRight size={17}/></span>
      </button>)}
    </div>
    {!shown.length && <div className={styles.emptyDirectory}>No matching stops. Try another search.</div>}
    {!expanded && !search && filtered.length > shown.length && <button className={styles.showMore} onClick={() => setExpanded(true)}>Show all {filtered.length} stops <ArrowRight size={16}/></button>}
    {expanded && !search && <button className={styles.showMore} onClick={() => setExpanded(false)}>Show fewer stops ↑</button>}
  </section>;
}

/**
 * Client-only route explorer. Shared navbar, login state and footer live in the
 * issue-1 root layout so this feature does not duplicate application chrome.
 */
export default function TransitPage() {
  const [now, setNow] = useState<Date>(new Date());
  const [selectedStopId, setSelectedStopId] = useState('sh-hawaiian');
  const [filter, setFilter] = useState<'all' | Service>('all');
  const [dismissed, setDismissed] = useState(false);
  const clock = useMemo(() => getHonoluluClock(now), [now]);

  useEffect(() => {
    const handle = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(handle);
  }, []);

  const selectStop = (id: string) => {
    setSelectedStopId(id);
    if (filter !== 'all' && ALL_STOPS.find((stop) => stop.id === id)?.service !== filter) setFilter('all');
  };

  return <div className={styles.page}>
    <div className={styles.topline}><span>BUILT FOR THE BOWS</span><span>UH MĀNOA • HONOLULU, HI</span></div>
    {/* Shared issue-1 Navbar from src/components/Navbar.tsx is rendered by the root layout. */}
    <main className={styles.main}>
      {/*
      <section className={styles.hero}>
        <div className={styles.heroText}><span className={styles.heroEyebrow}><span className={styles.heroPulse}/> CAMPUS COMMUTE, SORTED</span><h1>Get there.<br/><span>Get studying.</span></h1><p>The easiest way to find your next ride around UH Mānoa. Explore campus stops, compare options, and spend less time guessing at the curb.</p><div className={styles.heroCtas}><a href="#map" className={styles.primaryCta}>Explore the map <ArrowRight size={18}/></a><a href="#stops" className={styles.secondaryCta}>Find a stop <MapPin size={17}/></a></div></div>
        <div className={styles.heroRight}><div className={styles.heroSticker}><span className={styles.stickerSun}>✳</span><strong>LESS<br/>WAITING.<br/>MORE<br/>LIVING.</strong><span className={styles.stickerCorner}>↗</span></div><div className={styles.heroScribble}>your next ride<br/>is calling! ↗</div></div>
      </section>
      <div className={styles.infoStrip}>
        <div><span className={styles.stripIcon}><Route size={20}/></span><strong>2 transit systems</strong><span>TheBus + Rainbow Shuttle</span></div>
        <div><span className={styles.stripIcon}><MapPin size={20}/></span><strong>{ALL_STOPS.length} featured stops</strong><span>Campus + close-by connections</span></div>
        <div><span className={styles.stripIcon}><Clock3 size={20}/></span><strong>{clock.label} HST</strong><span>Honolulu local time</span></div>
      </div>
      */}
      {!dismissed && <div className={styles.previewNotice}><Info size={18}/><div><strong>Quick heads-up:</strong> TheBus arrivals are sample data in this mockup. The Rainbow Shuttle times are calculated from UH’s published timetable, not GPS tracking. The map is schematic.</div><button onClick={() => setDismissed(true)} aria-label="Dismiss preview notice"><X size={18}/></button></div>}
      <section className={styles.mainPanels} id="map" aria-label="Campus transit map and arrivals">
        <div className={styles.mapColumn}><div className={styles.panelHead}><div><span className={styles.eyebrow}>THE CAMPUS CONNECTION</span><h2>Where to catch your ride<span className={styles.titleStar}>.</span></h2></div><span className={styles.panelHeadBadge}><LocateFixed size={14} /> CAMPUS VIEW</span></div><TransitMap stops={ALL_STOPS} selectedStopId={selectedStopId} onSelectStop={selectStop} visibleService={filter}/><p className={styles.mapCaveat}><Info size={13}/> Pin positions and route lines are approximate; check <a href={SOURCES.officialBusMap} target="_blank" rel="noreferrer">TheBus campus stop map</a> and the shuttle map before traveling.</p></div>
        <div className={styles.sideColumn}><NextArrivals now={now} selectedStopId={selectedStopId} onRefresh={() => setNow(new Date())}/><ShuttleCard now={now} selectedStopId={selectedStopId} onSelectStop={selectStop}/></div>
      </section>
      <StopDirectory selectedStopId={selectedStopId} onSelectStop={selectStop} filter={filter} setFilter={setFilter}/>
      <section className={styles.tips} aria-label="Student commuter tips">
        <div className={styles.tipsHead}><span className={styles.eyebrow}>THE STUDENT SHORTCUT</span><h2>Ride smarter, not harder.</h2></div>
        <article><span className={styles.tipNumber}>01</span><GraduationCap size={27}/><h3>Got your OneCard?</h3><p>Eligible UH Mānoa students get TheBus rides through U-PASS. Your UH student ID is your ticket.</p><a href={SOURCES.theBusUH} target="_blank" rel="noreferrer">U-PASS details <ArrowUpRight size={15}/></a></article>
        <article><span className={styles.tipNumber}>02</span><BusFront size={27}/><h3>Shuttle = zero fare.</h3><p>Rainbow Shuttle is free for UH affiliates with valid ID, on weekdays during fall and spring semesters.</p><a href={SOURCES.rainbowOverview} target="_blank" rel="noreferrer">Shuttle details <ArrowUpRight size={15}/></a></article>
        <article><span className={styles.tipNumber}>03</span><Compass size={27}/><h3>Connect to Skyline.</h3><p>A Line and U Line connect Mānoa with Āhua Lagoon Drive Station, opening up more ways to commute.</p><a href={SOURCES.skyline} target="_blank" rel="noreferrer">Plan a connection <ArrowUpRight size={15}/></a></article>
      </section>
    </main>
    {/* Shared issue-1 Footer is rendered once by the root layout. */}
  </div>;
}
