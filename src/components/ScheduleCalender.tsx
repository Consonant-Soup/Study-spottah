'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import ScheduleInvitesForm from './ScheduleInvitesForm';
import styles from './ScheduleCalender.module.css';

type ScheduleCalenderProps = {
  spotName: string;
};

type MonthCalendarProps = {
  month: Date;
  earliestDate: Date;
  selectedDate: string;
  onSelectDate: (date: Date) => void;
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeOptions = Array.from({ length: 28 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const label = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, hours, minutes));

  return { value, label };
});

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getMonthDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from(
      { length: dayCount },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
    ),
  ];
};

const MonthCalendar = ({
  month,
  earliestDate,
  selectedDate,
  onSelectDate,
}: MonthCalendarProps) => (
  <section className={styles.month} aria-label={month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}>
    <h3 className={styles.monthTitle}>
      {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
    </h3>
    <div className={styles.calendarGrid} role="grid">
      {dayLabels.map((day) => (
        <span className={styles.dayLabel} key={day} role="columnheader">
          {day}
        </span>
      ))}
      {getMonthDays(month).map((date, index) => {
        if (!date) {
          return <span className={styles.emptyDay} key={`empty-${index}`} aria-hidden="true" />;
        }

        const key = toDateKey(date);
        const unavailable = key < toDateKey(earliestDate);
        const selected = key === selectedDate;

        return (
          <button
            aria-label={date.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            aria-pressed={selected}
            className={`${styles.dateButton} ${selected ? styles.selectedDate : ''}`}
            disabled={unavailable}
            key={key}
            onClick={() => onSelectDate(date)}
            type="button"
          >
            {date.getDate()}
          </button>
        );
      })}
    </div>
  </section>
);

const ScheduleCalender = ({ spotName }: ScheduleCalenderProps) => {
  const [now, setNow] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [step, setStep] = useState<'date' | 'guests' | 'complete'>('date');
  const [usernames, setUsernames] = useState<string[]>([]);

  // Refresh the date boundary in the open page so tomorrow is always calculated from real time.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const currentTime = new Date();
      const nextDay = toDateKey(
        new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1),
      );
      setNow(currentTime);
      if (selectedDate && selectedDate < nextDay) {
        setSelectedDate('');
        setStartTime('');
        setEndTime('');
        setStep('date');
      }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [selectedDate]);

  const earliestDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const availableSelectedDate =
    selectedDate >= toDateKey(earliestDate) ? selectedDate : '';

  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const validStartTimes = timeOptions.slice(0, -1);
  const validEndTimes = timeOptions.filter((option) => option.value > startTime);

  const sessionDate = availableSelectedDate
    ? new Date(`${availableSelectedDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    if (value && endTime <= value) {
      setEndTime('');
    }
  };

  return (
    <main className={styles.page}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Link className={styles.backLink} href="/schedule">
              ← Choose a different spot
            </Link>
            <p className={styles.eyebrow}>Schedule a study session</p>
            <h1 className={styles.heading}>{spotName}</h1>

            {step === 'date' && (
              <section className={styles.card} aria-labelledby="date-step-title">
                <div className={styles.cardHeader}>
                  <div>
                    <p className={styles.stepLabel}>STEP 1 OF 3</p>
                    <h2 id="date-step-title">Pick a date and time</h2>
                  </div>
                  <p className={styles.helper}>Sessions can be scheduled from tomorrow onward.</p>
                </div>
                <div className={styles.months}>
                  <MonthCalendar
                    earliestDate={earliestDate}
                    month={currentMonth}
                    onSelectDate={(date) => setSelectedDate(toDateKey(date))}
                    selectedDate={availableSelectedDate}
                  />
                  <MonthCalendar
                    earliestDate={earliestDate}
                    month={nextMonth}
                    onSelectDate={(date) => setSelectedDate(toDateKey(date))}
                    selectedDate={availableSelectedDate}
                  />
                </div>
                <div className={styles.timeFields}>
                  <label>
                    Start time
                    <select
                      onChange={(event) => handleStartTimeChange(event.target.value)}
                      value={startTime}
                    >
                      <option value="">Select a start time</option>
                      {validStartTimes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    End time
                    <select
                      disabled={!startTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      value={endTime}
                    >
                      <option value="">Select an end time</option>
                      {validEndTimes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.cardFooter}>
                  <p className={styles.helper}>
                    {sessionDate ? `${sessionDate}${startTime && endTime ? ` · ${timeOptions.find((option) => option.value === startTime)?.label}–${timeOptions.find((option) => option.value === endTime)?.label}` : ''}` : 'Select a date and time period to continue.'}
                  </p>
                  <button
                    className={styles.primaryButton}
                    disabled={!availableSelectedDate || !startTime || !endTime}
                    onClick={() => setStep('guests')}
                    type="button"
                  >
                    Add study group
                  </button>
                </div>
              </section>
            )}

            {step === 'guests' && (
              <ScheduleInvitesForm
                onBack={() => setStep('date')}
                onSend={() => setStep('complete')}
                onUsernamesChange={setUsernames}
                sessionDate={sessionDate}
                sessionTime={`${timeOptions.find((option) => option.value === startTime)?.label}–${timeOptions.find((option) => option.value === endTime)?.label}`}
                usernames={usernames}
              />
            )}

            {step === 'complete' && (
              <section className={styles.card} aria-labelledby="complete-title">
                <p className={styles.stepLabel}>STEP 3 OF 3</p>
                <div className={styles.completionMark} aria-hidden="true">✓</div>
                <h2 className={styles.completionTitle} id="complete-title">Invitations sent!</h2>
                <p className={styles.completionText}>
                  Your invitation for {spotName} on {sessionDate} has been sent to:
                </p>
                <ul className={styles.completionList}>
                  {usernames.map((username) => <li key={username}>@{username}</li>)}
                </ul>
                <p className={styles.helper}>This is a mockup. No invitations were actually sent.</p>
                <Link className={styles.primaryButton} href="/schedule">
                  Schedule another session
                </Link>
              </section>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ScheduleCalender;
