import axios from "axios"

export default class ContactForm {
    constructor (el) {
		this.element = el;
	}
	
	init (testing) {
		this.testing = testing;
		if (testing) console.log('form is in TESTING mode');
		else console.log('form is in LIVE mode');

		// get form element references
		this.$name = this.element.querySelector('[id="contact-name"]');
		this.$email = this.element.querySelector('[id="contact-email"]');
		this.$street = this.element.querySelector('[id="contact-street"]');
		this.$submit = this.element.querySelector('[name="submit"]');

		this.$stateDefault = this.element.querySelector('.state-default');
		this.$stateSuccess = this.element.querySelector('.state-success');

		// attach submit behavior
		this.onSubmit = this.onSubmit.bind(this);
		this.element.addEventListener('submit', this.onSubmit);
	}

	getEndpoint () {
		return this.testing ? 'https://reqres.in/api/users?delay=2' : 'http://n8-vm1.eastus.cloudapp.azure.com:90/api/status/1/customers';
	}

	onSubmit (event) {
		event.preventDefault();
		// TODO check validation details with Dave
		let valid = true
		if (this.$name.value.length < 2) {
			valid = false
		}
		if (!this.isValidEmail(this.$email.value)) {
			valid = false
		}
		if (this.$street.value.length < 2) {
			valid = false;
		}
		if (valid) {
			this.submitAjaxForm();
		} else {
			alert('You must fill out all fields with valid values.');
		}
	}

	isValidEmail (str) {
		// TODO add proper email validation regex
		return str.length > 5
	}
	

	submitAjaxForm () {
		const $loadingOverlay = this.element.querySelector('.loading-overlay');
		this.showElement($loadingOverlay);
		const endpoint = this.getEndpoint();

		if (this.testing) {
			axios
				.post(endpoint, this.getFormJson())
				.then(res => {
					console.log(res)
					this.hideElement(this.$stateDefault);
					this.showElement(this.$stateSuccess);
					this.hideElement($loadingOverlay);
				})
				.catch(err => console.error(err))
		} else {
			axios
				.get(endpoint)
				.then(res => {
					this.hideElement(this.$stateDefault);
					this.showElement(this.$stateSuccess);
					this.hideElement($loadingOverlay);
				})
				.catch(err => console.error(err))
		}
	}

	hideElement (el) {
		el.style.display = 'none'
	}
	
	showElement (el) {
		el.style.display = 'block'
	}

	getFormJson () {
		return {
			"Name": this.$name.value,
			"Email": this.$email.value,
			"Address": this.$street.value
		}
	}
	
    log () {
        console.log("ContactForm.log()")
    }
}
