import { Component, Input } from '@angular/core';

/**
 * A card with an action bar.
 */
@Component({
  selector: 'eno-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss'],
})
export class ActionCardComponent {
  @Input() floating = false;
}
