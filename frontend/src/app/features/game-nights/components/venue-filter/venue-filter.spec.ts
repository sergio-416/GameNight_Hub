import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VenueFilter } from './venue-filter';
import { beforeEach, expect, describe, it } from 'vitest';

describe('VenueFilter', () => {
	let fixture: ComponentFixture<VenueFilter>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VenueFilter],
		}).compileComponents();

		fixture = TestBed.createComponent(VenueFilter);
	});

	describe('venue type options', () => {
		it('should display all venue type checkboxes when component loads', () => {
			fixture.detectChanges();

			const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
			expect(checkboxes.length).toBe(5);
		});

		it('should display correct labels for each venue type', () => {
			fixture.detectChanges();

			const labels = fixture.nativeElement.querySelectorAll('label');
			expect(labels[0].textContent).toContain('Café');
			expect(labels[1].textContent).toContain('Store');
		});
	});

	describe('filter selection', () => {
		it('should emit selected venue types when checkbox is checked', () => {
			const filterChangeSpy = vi.fn();
			fixture.componentInstance.filterChange.subscribe(filterChangeSpy);

			fixture.detectChanges();

			const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
			checkbox.click();
			fixture.detectChanges();

			expect(filterChangeSpy).toHaveBeenCalledWith(['cafe']);
		});

		it('should remove venue type from emission when checkbox is unchecked', () => {
			const filterChangeSpy = vi.fn();
			fixture.componentInstance.filterChange.subscribe(filterChangeSpy);

			fixture.detectChanges();

			const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
			checkbox.click();
			fixture.detectChanges();
			checkbox.click();
			fixture.detectChanges();

			expect(filterChangeSpy).toHaveBeenLastCalledWith([]);
		});

		it('should emit multiple venue types when multiple checkboxes selected', () => {
			const filterChangeSpy = vi.fn();
			fixture.componentInstance.filterChange.subscribe(filterChangeSpy);

			fixture.detectChanges();

			const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
			checkboxes[0].click();
			checkboxes[1].click();
			fixture.detectChanges();

			expect(filterChangeSpy).toHaveBeenLastCalledWith(['cafe', 'store']);
		});
	});

	describe('visual feedback', () => {
		it('should show checkbox as checked when venue type is selected', () => {
			fixture.detectChanges();

			const checkbox = fixture.nativeElement.querySelector(
				'input[type="checkbox"]',
			) as HTMLInputElement;
			expect(checkbox.checked).toBe(false);

			checkbox.click();
			fixture.detectChanges();

			expect(checkbox.checked).toBe(true);
		});
	});
});
