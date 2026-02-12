import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header Navigation', () => {
	let fixture: ComponentFixture<Header>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Header],
			providers: [provideRouter([])],
		}).compileComponents();
		fixture = TestBed.createComponent(Header);
		await fixture.whenStable();
	});

	it('should display all navigation links', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		const links = compiled.querySelectorAll('a');

		expect(links.length).toBe(6);

		const linkTexts = Array.from(links).map((link) => link.textContent?.trim());

		expect(linkTexts).toContain('Home');
		expect(linkTexts).toContain('Collection');
		expect(linkTexts).toContain('Game Nights');
		expect(linkTexts).toContain('Calendar');
		expect(linkTexts).toContain('Stats');
	});
});
