import { For } from 'solid-js';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import "./Tzolkin.css"

const root: HtmlElement = document.getElementById('root');

type Event = { id: number, title: string, location: string, startDate: Date, endDate: Date, color: string };

const formatTime: Date = (date) => {
  return date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
}

export const CalendarEvent: Component<{event: Event}> = (props) => {
  const { id, title, location, startDate, endDate, color } = props.event;

  return (
    <fieldset class="event" style={{
        "top": (((startDate.getHours() * 60) + startDate.getMinutes()) / (24 * 60) * 100) + "%",
        "height": endDate ? ((endDate - startDate) / (24 * 60 * 60 * 1000) * 100) + "vh" : "0px",
        "border-color": color,
        "color": color,
        "border-left": endDate ? undefined : "none"
    }}>
      <legend>{formatTime(startDate) + (endDate ? " — " + formatTime(endDate) : "")}</legend>
      <div class="title">{title}</div>
      <div class="location">{location}</div>
    </fieldset>
  );
};

export const Calendar: Component = () => {
  const [events, setEvents] = createStore<Event[]>([]),
        now: number = Date.now(),
        days: Date[] = Array.from({length: 7}, (_, d) => new Date(now + (d * 24 * 60 * 60 * 1000)));

  setEvents([
    { id: 0, startDate: new Date(), color: "black" },
    { id: 1, title: "foo", location: "https://foo.com/slkdhf", startDate: new Date(now + 60 * 60 * 1000), endDate: new Date(now + 120 * 60 * 1000), color: "blue" },
    { id: 3, title: "foo1", location: "https://foo.com/zoom", startDate: new Date(now + 90 * 60 * 1000), endDate: new Date(now + 180 * 60 * 1000), color: "red" },
    { id: 2, title: "bar", location: "office", startDate: new Date(now + 20 * 60 * 60 * 1000), endDate: new Date(now + 20.5 * 60 * 60 * 1000), color: "blue" },
  ]);

  const groups = Object.groupBy(events, ({startDate}) => startDate.getDay());

  return (
    <div class="calendar">
      <For each={days}>
        {(day) => {
          return (
            <div class="day">
              <div class="day-header">{day.toLocaleString(navigator.language || navigator.userLanguage, {day: "2-digit", weekday: "short"})}</div>
              <div class="events">
                <For each={groups[day.getDay()]}>
                  {(ev) => <CalendarEvent event={ev}/>}
                </For>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

render(() => <Calendar/>, root);

// vim: tabstop=2 shiftwidth=2 expandtab
