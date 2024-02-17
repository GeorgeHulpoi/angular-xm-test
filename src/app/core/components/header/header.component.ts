import {NgClass} from '@angular/common';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: 'header.component.html',
	styleUrl: 'header.component.scss',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, NgClass, MatButtonModule],
})
export class HeaderComponent {
	readonly btnDefaultClasses = ['mdc-button--outlined', 'mat-mdc-outlined-button'];
	readonly btnActiveClasses = ['mat-primary', 'mdc-button--unelevated', 'mat-mdc-unelevated-button'];
}
