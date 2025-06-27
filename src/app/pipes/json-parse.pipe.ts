import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonParse' })
export class JsonParsePipe implements PipeTransform {
  transform(value: string): any[] {
    try {
      const parsed = JSON.parse(value);
      // S'assurer que le résultat est un tableau
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
