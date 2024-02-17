import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {HeaderComponent} from './core/components/header/header.component';
import {FavoritesService} from './core/services/favorites.service';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [RouterOutlet, HeaderComponent],
	providers: [FavoritesService],
})
export class AppComponent {}
