import axios from "axios"

const ENDPOINT = 'http://n8-vm1.eastus.cloudapp.azure.com:90/api/status/1/customers';

export default class ContactForm {
    constructor (el) {
		this.element = el;
		console.log('ContactForm element = ' + el);
	}
	
	init () {
		// get form element references
		this.$name = this.element.querySelector('[id="contact-name"]');
		this.$email = this.element.querySelector('[id="contact-email"]');
		this.$street = this.element.querySelector('[id="contact-street"]');
		this.$submit = this.element.querySelector('[name="submit"]');
		// attach submit behavior
		this.onSubmit = this.onSubmit.bind(this);
		this.element.addEventListener('submit', this.onSubmit);
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
		console.log('posting', this.getFormJson())
		axios
			.post(ENDPOINT, this.getFormJson())
			.then(res => {
				console.log(res)
				// hideElement($form)
				// showElement($successMessage)
			})
			.catch(err => console.log(err))
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
