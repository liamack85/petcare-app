"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    status: string;
    services: string[];
    employee?: string | null;
    client?: string | null;
    pet: string;
  };
};

export default function AppointmentCalendar({
  events,
}: {
  events: CalendarEvent[];
}) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <div>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectEvent={(event) => setSelected(event as CalendarEvent)}
          style={{ height: "100%" }}
          eventPropGetter={(event) => {
            const e = event as CalendarEvent;
            const color =
              e.resource?.status === "APPROVED"
                ? "#16a34a"
                : e.resource?.status === "PENDING"
                  ? "#ca8a04"
                  : "#dc2626";
            return {
              style: {
                backgroundColor: color,
                borderRadius: "4px",
                border: "none",
                color: "white",
                fontSize: "12px",
              },
            };
          }}
        />
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Date: </span>
                {format(selected.start, "EEEE, MMMM d, yyyy")}
              </p>
              <p>
                <span className="text-gray-500">Time: </span>
                {format(selected.start, "h:mm a")}
              </p>
              {selected.resource?.services && (
                <p>
                  <span className="text-gray-500">Services: </span>
                  {selected.resource.services.join(", ")}
                </p>
              )}
              {selected.resource?.employee && (
                <p>
                  <span className="text-gray-500">Employee: </span>
                  {selected.resource.employee}
                </p>
              )}
              {selected.resource?.client && (
                <p>
                  <span className="text-gray-500">Client: </span>
                  {selected.resource.client}
                </p>
              )}
              <p>
                <span className="text-gray-500">Status: </span>
                <span
                  className={
                    selected.resource?.status === "APPROVED"
                      ? "text-green-600 font-medium"
                      : selected.resource?.status === "PENDING"
                        ? "text-yellow-600 font-medium"
                        : "text-red-600 font-medium"
                  }
                >
                  {selected.resource?.status}
                </span>
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
