import ContactForm from '../modules/contact-form'

const urlParams = new URLSearchParams(window.location.search);
let testing = false;
if (urlParams) {
	testing = urlParams.has('test') || urlParams.has('testing');
}

const $form = new ContactForm(document.querySelector('.contact-form'));
$form.init(testing);
/*
// const $heroChart = document.getElementById('hero-dynamic');

const data = [
	{
		x: ['Morningside-Lenox Park', 'Virginia-Highland', 'Old Fourth Ward', 'Reynoldstown', 'Inman Park'],
		y: [6,7,13,9,11],
		type: 'bar',
		marker: {
			color: [
				'rgb(237, 125, 49)', // ml
				'rgb(68, 114, 196)', // vh
				'rgb(165, 165, 165)', // o4
				'rgb(255, 192, 1)', // re
				'rgb(91, 154, 213)' // ip
			]
		}
	}
];

const layout = {
	showlegend: false,
	paper_bgcolor: '#f7f7f7'
};

const config = {
	displayModeBar: false,
	staticPlot: true
};

if (Plotly) Plotly.newPlot('hero-dynamic', data, layout, config);
*/

/*
Morningside-Lenox Park	6%
Virginia-Highland	7%
Old Fourth Ward	13%
Reynoldstown	9%
Inman Park	11%
*/
