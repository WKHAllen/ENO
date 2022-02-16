import { Component, Input } from '@angular/core';

@Component({
  selector: 'eno-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.less'],
})
export class LinkComponent {
  @Input() destination: string = '/';
  @Input() newTab: boolean = false;
  @Input() textStyling: boolean = true;
}
