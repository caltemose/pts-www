import ContactForm from '../modules/contact-form'

const urlParams = new URLSearchParams(window.location.search);
let testing = false;
if (urlParams) {
	testing = urlParams.has('test') || urlParams.has('testing');
}

const $form = new ContactForm(document.querySelector('.contact-form'));
$form.init(testing);
