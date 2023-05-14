import { AfterViewInit, Component } from '@angular/core';
import { floor, number, random, round } from 'mathjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface MatchHistory {
	Player1: string;
	P1URL: string;
	P1score: number;
	Player2: string;
	P2URL: string;
	P2score: number;
	date: Date;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit {
	matchHistory: Array<MatchHistory>;
	matchChart!: Chart;

	constructor() {
		Chart.register(ChartDataLabels);
		const nbGenerate = 100;
		this.matchHistory = new Array;
		let time = new Date();
		for (let index = 0; index < nbGenerate; index++) {
			const chooseWinner = round(random(0,1));
			const randScore = round(random(0,9));
			const randTime = random(20, 200);
			const min = floor(randTime % 60);
			const hour = floor((randTime / 60) % 24);
			const days = floor(randTime / 60 / 24);
			time = this.forgeDate(time, days, hour, min);
			this.matchHistory.push({
				Player1: 'Mr. Connasse',
				P1URL: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp',
				P1score: chooseWinner ? 10 : randScore,
				Player2: 'Pedro',
				P2URL: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
				P2score: !chooseWinner ? 10 : randScore,
				date: time,
			});
		}
	}

	ngAfterViewInit(): void {
		this.matchChart = new Chart(document.getElementById('matchChart') as HTMLCanvasElement, this.getMatchChartConfig())
	}

	getMatchChartConfig(): ChartConfiguration {
		let delayed: boolean;
		return {
			type: 'doughnut',
			data: {
				labels: [''],
				datasets: [
					{
						label: 'Scores',
						data: this.countScores(),
						backgroundColor: [
							'rgba(255, 20, 132, 1)',
							'rgba(255, 40, 132, 1)',
							'rgba(255, 60, 132, 1)',
							'rgba(255, 80, 132, 1)',
							'rgba(255, 100, 132, 1)',
							'rgba(255, 120, 132, 1)',
							'rgba(255, 140, 132, 1)',
							'rgba(255, 160, 132, 1)',
							'rgba(255, 180, 132, 1)',
							'rgba(255, 200, 132, 1)',
							'rgba(54, 20, 235, 1)',
							'rgba(54, 40, 235, 1)',
							'rgba(54, 60, 235, 1)',
							'rgba(54, 80, 235, 1)',
							'rgba(54, 100, 235, 1)',
							'rgba(54, 120, 235, 1)',
							'rgba(54, 140, 235, 1)',
							'rgba(54, 160, 235, 1)',
							'rgba(54, 180, 235, 1)',
							'rgba(54, 200, 235, 1)',
						],
						datalabels: {
							formatter: function (value, context) {
								const total = context.dataset.data.reduce((a, b) => ((a as number) + (b as number)), 0);
								if (!total || total == 0)
									return;
								const percentage = Math.round((value / (total as number)) * 100);
								return percentage + "%";
								// return context.dataIndex;
							},
						}
					},
					{
						label: 'Wins & Losses',
						data: this.getRatio(),
						backgroundColor: [
							'rgba(255, 20, 132, 1)',
							'rgba(54, 200, 235, 1)',
						],
						datalabels: {
							formatter: function (value, context) {
								if (context.dataIndex == 0)
									return 'Losses';
								return 'Wins';
							},
						}
					},
				]
			  },
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false,
						position: 'center',
					},
					title: {
						display: false,
						text: 'Wins / Losses',
					},
					subtitle: {
						display: false,
						text: 'Custom Chart Subtitle'
					},
					tooltip: {
						callbacks: {
							label: function(context) {
								let label = context.dataset.label || '';
								if (label == 'Scores') {
									if (context.dataIndex >= 10)
										return context.dataset.data[context.dataIndex] + ' matches won with ' + (context.dataIndex - 10) + ' points for the opponent';
									return context.dataset.data[context.dataIndex] + ' matches lost with ' + context.dataIndex + ' points';
								}
								else {
									if (context.dataIndex == 0)
										return context.dataset.data[context.dataIndex] + ' losses'
									return context.dataset.data[context.dataIndex] + ' wins'
								}
								return label;
							},
							title: function(context) { return ''; },
							labelColor: function(context) { return; },
							labelPointStyle: function(context) {
								return {
									pointStyle: 'triangle',
									rotation: 0
								};
							}
						},
						displayColors: false,
					},
					datalabels: {
						anchor: 'center',
						display: function(context): boolean {
							return (context.dataset.data[context.dataIndex] != 0); // display labels with an odd index
						},
					}
				},
				animation: {
					onComplete: () => {
						delayed = true;
					},
					delay: (context) => {
						let delay = 0;
						if (context.type === 'data' && context.mode === 'default' && !delayed) {
							delay = context.dataIndex * 150 + context.datasetIndex * 50;
						}
						return delay;
					},
				},
			}
		};
	}

	countScores() {
		let ret = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.matchHistory.forEach(match => {
			if (match.Player1 == 'Mr. Connasse') {
				if (match.P1score == 10)
					ret[match.P2score + 10]++;
				else ret[match.P1score]++;
			}
			else {
				if (match.P2score == 10)
					ret[match.P1score + 10]++;
				else ret[match.P2score]++;
			}
		})
		return ret;
	}

	getRatio() {
		let ret = [0, 0];
		const score = this.countScores();
		for (let i = 0; i < 10; i++) {
			ret[0] += score[i];
		}
		ret[1] = (this.matchHistory.length - ret[0]);
		return ret;
	}

	forgeDate(date: Date, d: number, h: number, m: number) {
		const subTime = (d * 24 * 60 * 60 * 1000) + (h * 60 * 60 * 1000) + (m * 60 * 1000);
		return(new Date(date.getTime() - subTime));
	}

	isVictory(match: MatchHistory) {
		if (match.Player1 == 'Mr. Connasse')
			return (match.P1score == 10);
		return (match.P2score == 10);
	}

	getTimeDiff(timestamp: Date) {
		let str = new String();
		const time = new Date().getTime() - timestamp.getTime();

		const min = floor(time / (1000 * 60));
		const hour = floor(time / (1000 * 60 * 60));
		const days = floor(time / (1000 * 60 * 60 * 24));

		if (days > 0)
			str += days + ' day ';
		if (hour > 0)
			str += (hour - days * 24) + ' hour ';
		if (min > 0 && days < 1)
			str += (min - hour * 60) + ' min ';
		str += 'ago';
		return str;
	}
}