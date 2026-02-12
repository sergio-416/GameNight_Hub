import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { httpResource } from '@angular/common/http';
import { API_CONFIG } from '@core/config/api.config';
import { ApexChart, ApexAxisChartSeries, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';

export interface ChartOptions {
	series: ApexAxisChartSeries | number[];
	chart: ApexChart;
	title: ApexTitleSubtitle;
	xaxis?: ApexXAxis;
	labels?: string[];
}

interface StatsData {
	gamesByCategory: { name: string; value: number }[];
	complexityDistribution: { name: string; value: number }[];
	collectionGrowth: { x: string; y: number }[];
	totalGames: number;
}

@Component({
	selector: 'app-stats',
	standalone: true,
	imports: [CommonModule, NgApexchartsModule],
	templateUrl: './stats.html',
	styleUrl: './stats.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stats {
	readonly #apiUrl = API_CONFIG.baseUrl;

	readonly statsResource = httpResource<StatsData>(() => `${this.#apiUrl}/games/stats`);

	readonly gamesByCategoryData = computed(() => this.statsResource.value()?.gamesByCategory ?? []);
	readonly complexityDistributionData = computed(
		() => this.statsResource.value()?.complexityDistribution ?? [],
	);
	readonly collectionGrowthData = computed(
		() => this.statsResource.value()?.collectionGrowth ?? [],
	);
	readonly totalGames = computed(() => this.statsResource.value()?.totalGames ?? 0);

	readonly gamesByCategoryOptions = computed<ChartOptions>(() => ({
		series: [{ name: 'Games', data: this.gamesByCategoryData().map((item) => item.value) }],
		chart: { type: 'bar', height: 350 },
		title: { text: 'Games by Category' },
		xaxis: { categories: this.gamesByCategoryData().map((item) => item.name) },
	}));

	readonly collectionGrowthOptions = computed<ChartOptions>(() => ({
		series: [{ name: 'Total Games', data: this.collectionGrowthData() }],
		chart: { type: 'line', height: 350 },
		title: { text: 'Collection Growth Over Time' },
		xaxis: { type: 'datetime' },
	}));

	readonly complexityDistributionOptions = computed<ChartOptions>(() => ({
		series: this.complexityDistributionData().map((item) => item.value),
		chart: { type: 'pie', height: 350 },
		title: { text: 'Complexity Distribution' },
		labels: this.complexityDistributionData().map((item) => item.name),
	}));
}
