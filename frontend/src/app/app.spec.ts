import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	it('should render header component', () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();

		const headerElement = fixture.nativeElement.querySelector('app-header');
		expect(headerElement).toBeTruthy();
	});

	it('should render router outlet', () => {
		const fixture = TestBed.createComponent(App);
		fixture.detectChanges();

		const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
		expect(routerOutlet).toBeTruthy();
	});
});
