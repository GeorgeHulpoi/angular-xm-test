import {HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router} from '@angular/router';
import {catchError, of, throwError} from 'rxjs';

import type {PicsumResource} from '../../types';
import {PicsumService} from '../services/picsum.service';

export const singlePhotoResolver: ResolveFn<PicsumResource> = (route: ActivatedRouteSnapshot) => {
	const picsumService = inject(PicsumService);
	const router = inject(Router);

	const idParam = route.paramMap.get('id');
	const id = parseInt(idParam || ''); // parseInt('') will produce NaN

	const notFound = () => {
		router.navigate(['/not-found'], {skipLocationChange: true});
		return of();
	};

	if (isNaN(id)) {
		return notFound();
	}

	return picsumService.getInfo(id).pipe(
		catchError((err) => {
			if (err instanceof HttpErrorResponse) {
				if (err.status === 404) {
					return notFound();
				}
			}

			return throwError(() => err);
		}),
	);
};
