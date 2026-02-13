import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const auth = inject(Auth);

	if (!auth.currentUser) {
		return next(req);
	}

	return from(auth.currentUser.getIdToken()).pipe(
		switchMap((token) => {
			const clonedReq = req.clone({
				setHeaders: { Authorization: `Bearer ${token}` },
			});
			return next(clonedReq);
		}),
		catchError(() => next(req)),
	);
};
