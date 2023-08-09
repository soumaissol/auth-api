import type { LocaleProvider } from 'sms-api-commons';

import enMap from './languages-map/en';
import ptBrMap from './languages-map/pt-br';

export default class CustomLocaleProvider implements LocaleProvider {
  private map: any;

  constructor() {
    this.map = enMap;
  }
  getDefaultLocale(): string {
    return 'en';
  }
  getLocales(): string[] {
    return ['en', 'pt-br'];
  }
  setLocale(newLocale: string): void {
    switch (newLocale) {
      case 'pt-br':
        this.map = ptBrMap;
        return;
    }

    this.map = enMap;
  }
  getTranslation(text: string): string {
    return this.map[text] || text;
  }
}
