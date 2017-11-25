import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { GoogleCloudApiKey, insertAt } from '../../libs';

export type Iso639_1Code = string;

export interface Translation {
  detectedSourceLanguage: Iso639_1Code;
  translatedText: string;
}

interface TranslationOptions {
  format?: TranslationFormat;
  model?: TranslationModel;
  source?: Iso639_1Code;
}

interface TranslationResponse {
  data: {
    translations: Translation[];
  };
}

interface TranslateOptionsRequest {
  format?: TranslationFormat;
  model?: TranslationModel;
  source?: Iso639_1Code;
  target: Iso639_1Code;
}

export enum TranslationFormat {
  Html = 'html',
  PlainText = 'text',
}

export enum TranslationModel {
  /**
   * Neural Machine Translation (NMT).
   */
  Nmt = 'nmt',
  /**
   * Phrase-Based Machine Translation (PBMT).
   */
  Pbmt = 'base',
}

@Injectable()
export class TranslationService {
  private static apiKey: GoogleCloudApiKey;
  private static get apiUrl(): string {
    return `https://translation.googleapis.com/language/translate/v2?key=${TranslationService.apiKey}`;
  }

  constructor(private readonly httpClient: HttpClient) {}

  public translate(
    texts: string[],
    target: Iso639_1Code,
    options: TranslationOptions = {},
  ): Observable<Translation[]> {
    //const queryString = this.mapToTranslateQueryString(texts, target, options);

    return this.makeApiRequest(texts, target, options)
      .pipe(map(response => response.data.translations));
  }

  private makeApiRequest(
    texts: string[],
    target: Iso639_1Code,
    options: TranslationOptions,
  ): Observable<TranslationResponse> {
    return this.httpClient.post(
      TranslationService.apiUrl,
      this.mapToRequestJson(texts, target, options)) as Observable<TranslationResponse>;
  }

  private mapToRequestJson(
    texts: string[],
    target: Iso639_1Code,
    options: TranslationOptions,
  ): string {
    const apiOptions: TranslateOptionsRequest = {
      format: options.format,
      model: options.model,
      source: options.source,
      target: target,
    };
    const optionsJson: string = JSON.stringify(apiOptions);
    // The curly braces of the individual JSON parts are removed with `slice` to
    // make them combinable.
    const textsJson = texts.map(text =>
      JSON.stringify({ q: text }).slice(1, -1))
      .join(',');
    const beforeEndingCurlyBrace: number = optionsJson.length - 2;

    return insertAt(beforeEndingCurlyBrace, optionsJson, textsJson);
  }

  // private mapToTranslateQueryString(
  //   texts: string[],
  //   target: Iso639_1Code,
  //   options: TranslationOptions,
  // ): string {
  //   const request: TranslateOptionsRequest = {
  //     format: options.format,
  //     model: options.model,
  //     source: options.source,
  //     target: target,
  //   };
  //   const textsQueryString: string = texts
  //     .map(encodeURIComponent)
  //     .map(encodedText => `q=${encodedText}`)
  //     .join('&');
  //   const optionsQueryString: string = Object.entries(request)
  //     .map(parameter => parameter.join('='))
  //     .join('&');

  //   return textsQueryString + optionsQueryString;
  // }
}
