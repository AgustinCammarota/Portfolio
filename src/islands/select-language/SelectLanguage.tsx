import { navigate } from 'astro:transitions/client';
import type { Component, JSX } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { languages, ROUTES } from '@i18n/ui.ts';
import './select-language.css';

interface Props {
  currentLang: 'es' | 'en';
  currentLink: string;
  datepickerLabel: string;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
}

const SelectLanguage: Component<Props> = (props: Props) => {
  const [ selected, setSelected ] = createSignal<'en' | 'es'>(props.currentLang || 'en');
  let select!: HTMLSelectElement;

  const changeSelect = async (event: Event) => {
    event.preventDefault();
    const selectedLang = (event.target as HTMLSelectElement).value as 'es' | 'en';
    setSelected(selectedLang);
    const path = props.currentLink ? `${props.currentLink}/` : '';
    await navigate(ROUTES[selected()].concat(path));
  }

  const openSelect = (event: Event): void => {
    event.preventDefault();
    select.showPicker();
  };

  return (
      <label onClick={openSelect} class="language-container" for="language">
        <span class="sr-only">{props.datepickerLabel}</span>
        {props.iconLeft}
        <select
            ref={(el) => select = el}
            onChange={changeSelect}
            value={selected()}
            id="language"
            class="language-select">
          <For each={Object.keys(languages) as Array<keyof typeof languages>}>
            {
              (lang) =>
                  <option class="language-option" selected={selected() === lang} value={lang}>
                    {languages[lang]}
                  </option>
            }
          </For>
          {selected()}
        </select>
        {props.iconRight}
      </label>
  )
}

export {
  SelectLanguage
}
