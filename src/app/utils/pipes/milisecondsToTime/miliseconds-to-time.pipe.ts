import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'milisecondsToTime' })
export class MilisecondsToTimePipe implements PipeTransform {
  transform(milliseconds: number): string {
    // Calculate hours and minutes from milliseconds
    const totalMinutes = Math.floor(milliseconds / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Format hours and minutes into a string
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Create the time string in 'HH:mm' format
    const timeString = `${formattedHours}:${formattedMinutes}`;

    return timeString;
  }
}
