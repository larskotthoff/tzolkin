import { For } from 'solid-js';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';

import "./Tzolkin.css"

const root: HtmlElement = document.getElementById('root');

type Event = { id: number, title: string, location: string, startDate: Date, endDate: Date };

export const CalendarEvent: Component<{event: Event}> = (props) => {
  const { id, title, location, startDate, endDate } = props.event;

  return (
    <fieldset class="event" style={{
        "top": (((startDate.getHours() * 60) + startDate.getMinutes()) / (24 * 60) * 100) + "%",
        "height": ((endDate - startDate) / (24 * 60 * 60 * 1000) * 100) + "%"
    }}>
      <legend>{startDate.toLocaleTimeString() + "--" + endDate.toLocaleTimeString()}</legend>
      <div class="title">{title}</div>
      <div class="location">{location}</div>
    </fieldset>
  );
}

export const Calendar: Component = () => {
  const [events, setEvents] = createStore<Event[]>([]),
        now: number = Date.now(),
        days: Date[] = Array.from({length: 7}, (_, d) => new Date(now + (d * 24 * 60 * 60 * 1000)));

  setEvents([
    { id: 1, title: "foo", location: "https://foo.com/slkdhf", startDate: new Date(), endDate: new Date(now + 60 * 60 * 1000) },
    { id: 2, title: "bar", location: "office", startDate: new Date(now + 20 * 60 * 60 * 1000), endDate: new Date(now + 20.5 * 60 * 60 * 1000) },
  ]);

  const groups = Object.groupBy(events, ({startDate}) => startDate.getDay());

  return (
    <div>
      <For each={days}>
        {(day) => {
          return (
            <div class="day">
              <div class="day-header">{day.toLocaleString(navigator.language || navigator.userLanguage, {weekday: "short"})}</div>
              <For each={groups[day.getDay()]}>
                {(ev) => <CalendarEvent event={ev}/>}
              </For>
            </div>
          );
        }}
      </For>
    </div>
  );
};

render(() => <Calendar/>, root);

// vim: tabstop=2 shiftwidth=2 expandtab
