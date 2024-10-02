import type { Component } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { languages, ROUTES } from '@i18n/ui.ts';
import './select-language.css';

interface Props {
  currentLang: 'es' | 'en';
  currentLink: string;
}

const SelectLanguage: Component<Props> = (props: Props) => {
  const [ selected, setSelected ] = createSignal<'en' | 'es'>(props.currentLang || 'en')

  const changeSelect = (event: Event): void => {
    event.preventDefault();
    const selectedLang = (event.target as HTMLSelectElement).value as 'es' | 'en';
    setSelected(selectedLang);
    const path = props.currentLink ? `${props.currentLink}/` : '';
    document.location.href = ROUTES[selected()].concat(path);
  }

  return (
    <select onChange={changeSelect} value={selected()} id="language" class="language-select">
      <For each={Object.keys(languages) as Array<keyof typeof languages>}>
        {(lang) => <option class="language-option" selected={selected() === lang} value={lang}>{languages[lang]}</option>}
      </For>
      {selected()}
    </select>
  )
}

export {
  SelectLanguage
}
