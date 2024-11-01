import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Event {
  name: string;
  start: number;
  end: number;
}

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-manager.component.html',
  styleUrls: ['./event-manager.component.css'],
})
export class EventManagerComponent implements OnInit {
  name: string = '';
  start_time: number | null = null;
  end_time: number | null = null;
  events: Event[] = [];

  async ngOnInit() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    try {
      const response = await axios.get(
        'https://task-2-pgzc.onrender.com/get-events'
      );
      this.events = response.data.events;
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async addEvent() {
    if (this.start_time !== null && this.end_time !== null && this.name) {
      try {
        const response = await axios.post(
          'https://task-2-pgzc.onrender.com/add-event',
          {
            n: this.name,
            s: this.start_time,
            e: this.end_time,
          }
        );
        if (response.status === 200) {
          this.name = '';
          this.start_time = null;
          this.end_time = null;
          alert('Event added successfully!');
          await this.fetchEvents();
        }
      } catch (error) {
        const errorMessage =
          //@ts-ignore
          error?.response?.data?.message || 'Error adding event';
        alert(errorMessage);
      }
    } else {
      alert('Please fill in all fields!');
    }
  }
}
