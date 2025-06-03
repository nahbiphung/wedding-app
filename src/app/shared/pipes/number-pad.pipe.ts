import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberPad',
})
export class NumberPadPipe implements PipeTransform {
    transform(value: number): string {
        if (value < 10) {
            return '0' + value;
        }
        return value.toString();
    }
}
