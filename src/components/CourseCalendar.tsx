import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

export interface CourseCalendarAssessment {
  id: string;
  title: string;
  week_number?: number;
  due_at: string | null;
}

export const toDateKey = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function CourseCalendar({
  assessments,
  month,
  selectedDay,
  onMonthChange,
  onSelectedDayChange,
  loading = false,
  error = null,
  onSelectAssessment,
}: {
  assessments: CourseCalendarAssessment[];
  month: Date;
  selectedDay: string;
  onMonthChange: (month: Date) => void;
  onSelectedDayChange: (day: string) => void;
  loading?: boolean;
  error?: string | null;
  onSelectAssessment?: (assessment: CourseCalendarAssessment) => void;
}) {
  const today = new Date();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startOffset = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const eventsByDay = useMemo(() => {
    const grouped = new Map<string, CourseCalendarAssessment[]>();
    for (const assessment of assessments) {
      if (!assessment.due_at) continue;
      const key = toDateKey(assessment.due_at);
      if (!key) continue;
      grouped.set(key, [...(grouped.get(key) ?? []), assessment]);
    }
    return grouped;
  }, [assessments]);
  const selectedEvents = eventsByDay.get(selectedDay) ?? [];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="rounded p-1 text-cyan hover:bg-cyan/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="font-semibold text-cyan">
          {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="rounded p-1 text-cyan hover:bg-cyan/10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p role="status" className="text-sm text-light-gray">Loading course calendar...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-300">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-light-gray">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span key={`${day}-${index}`} className="py-1 font-semibold text-cyan/70">{day}</span>
            ))}
            {Array.from({ length: startOffset }, (_, index) => (
              <span key={`blank-${index}`} aria-hidden="true" />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const key = toDateKey(date);
              const hasEvent = (eventsByDay.get(key)?.length ?? 0) > 0;
              const isToday = key === toDateKey(today);
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={`${date.toLocaleDateString()}${hasEvent ? ', assessment due' : ''}`}
                  onClick={() => onSelectedDayChange(key)}
                  className={`relative min-h-8 rounded py-1 ${
                    key === selectedDay
                      ? 'bg-cyan text-navy'
                      : isToday
                        ? 'border border-cyan text-cyan'
                        : 'text-light-gray hover:bg-cyan/10'
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                        key === selectedDay ? 'bg-navy' : 'bg-cyan'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-cyan/20 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan/70">
              Selected date: {new Date(`${selectedDay}T12:00:00`).toLocaleDateString()}
            </p>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-light-gray">No assessment deadlines on this date.</p>
            ) : (
              <ul className="space-y-2">
                {selectedEvents.map((assessment) => (
                  <li key={assessment.id}>
                    <button
                      type="button"
                      onClick={() => onSelectAssessment?.(assessment)}
                      className="w-full rounded-md border border-cyan/20 bg-white/5 p-2 text-left hover:border-cyan/50"
                    >
                      <span className="block text-sm font-semibold text-cyan">{assessment.title}</span>
                      <span className="mt-1 block text-xs text-light-gray">
                        {assessment.week_number ? `Module ${assessment.week_number} · ` : ''}
                        Due {new Date(assessment.due_at ?? '').toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
