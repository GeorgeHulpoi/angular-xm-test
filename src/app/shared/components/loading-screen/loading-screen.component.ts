import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
	selector: 'app-loading-screen',
	template: '<mat-spinner diameter="48" strokeWidth="8"></mat-spinner>',
	styleUrl: 'loading-screen.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [MatProgressSpinnerModule],
})
export class LoadingScreenComponent {}
