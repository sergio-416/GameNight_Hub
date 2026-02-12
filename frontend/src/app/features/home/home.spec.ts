import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideRouter } from '@angular/router';

describe('Home', () => {
	let fixture: ComponentFixture<Home>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Home],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(Home);
	});

	describe('page display', () => {
		it('should render hero section with title and description', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			const title = compiled.querySelector('h1');
			const description = compiled.querySelector('p');

			expect(title?.textContent).toContain('Your Board Game Community, Organized');
			expect(description?.textContent).toContain('Track your collection');
		});

		it('should display Browse Collection button linking to /collection', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			const button = compiled.querySelector('a[routerlink="/collection"]');

			expect(button).toBeTruthy();
			expect(button?.textContent).toContain('Browse Collection');
		});

		it('should display Find Game Nights button linking to /game-nights', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			const button = compiled.querySelector('a[routerlink="/game-nights"]');

			expect(button).toBeTruthy();
			expect(button?.textContent).toContain('Find Game Nights');
		});

		it('should display feature cards with correct titles', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			const titles = compiled.querySelectorAll('h3.text-4xl');

			expect(titles.length).toBe(3);
			expect(titles[0]?.textContent).toContain('Build');
			expect(titles[1]?.textContent).toContain('Organize');
			expect(titles[2]?.textContent).toContain('Discover');
		});

		it('should render three feature cards with correct descriptions', () => {
			fixture.detectChanges();

			const compiled = fixture.nativeElement;
			const cards = compiled.querySelectorAll('article');
			const descriptions = compiled.querySelectorAll('article p.text-slate-500');

			expect(cards.length).toBe(3);
			expect(descriptions[0]?.textContent).toContain('personal board game library');
			expect(descriptions[1]?.textContent).toContain('Schedule game nights');
			expect(descriptions[2]?.textContent).toContain('local events');
		});
	});
});
