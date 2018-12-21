import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import { Container, Divider,Header,Segment,Form,Label,Dropdown,Input,TextArea} from 'semantic-ui-react';
import UserProfileStore from '../../stores/UserProfileStore';
import ReCAPTCHA from 'react-google-recaptcha';
import {publicRecaptchaKey} from '../../configs/general';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import {defineMessages} from 'react-intl';
import sendContactForm from '../../actions/home/sendContactForm';
import {getLanguageDisplayName, translationLanguages} from '../../common';
import SWAutoComplete from '../common/SWAutoComplete';

class ContactUs extends React.Component {



    constructor(props){
        super(props);
        this.state ={
            type : null,
            firstName:this.props.UserProfileStore.user.fname,
            lastName:this.props.UserProfileStore.user.lname,
            email: this.props.UserProfileStore.user.email,
            formValidationErrors: {},
        };

        this.handleInputChange = this.handleInputChange.bind(this);

        this.messages = defineMessages({
            swal_title:{
                id: 'contactUs.swal_title',
                defaultMessage:'Contact Us'
            },
            checkType_text:{
                id: 'contactUs.checkType_text',
                defaultMessage:'Please select the type of feedback'
            },
            swal_button:{
                id: 'contactUs.swal_button',
                defaultMessage:'Ok'
            },
            checkEmail_text:{
                id: 'contactUs.checkEmail_text',
                defaultMessage:'Please use a valid email address'
            },
            checkSummary_text:{
                id: 'contactUs.checkSummary_text',
                defaultMessage:'Please provide us a summary of your issue'
            },
            checkCaptcha_text:{
                id: 'contactUs.checkCaptcha_text',
                defaultMessage:'Please confirm you are not a bot',
            },
            typeOption_suggestion:{
                id: 'contactUs.typeOption_suggestion',
                defaultMessage: 'Suggestion'
            },
            typeOption_support:{
                id: 'contactUs.typeOption_support',
                defaultMessage: 'Support Issue'
            },
            typeOption_account:{
                id: 'contactUs.typeOption_account',
                defaultMessage: 'Account Issue'
            },
            typeOption_other:{
                id: 'contactUs.typeOption_other',
                defaultMessage: 'Other'
            },
            form_explanation:{
                id: 'contactUs.form_explanation',
                defaultMessage:'If you wish to contact us, please complete the form below. If you wish to report an issue with a particular deck, please use the Reporting button on the deck.'
            },
            form_subheader:{
                id: 'contactUs.form_subheader',
                defaultMessage:'Feedback'
            },
            form_type_label:{
                id: 'contactUs.form_type_label',
                defaultMessage:'Type of report:'
            },
            form_type_placeholder:{
                id: 'contactUs.form_type_placeholder',
                defaultMessage:'Select type of the report'
            },
            form_firstName_label:{
                id: 'contactUs.form_firstName_label',
                defaultMessage:'First Name:'
            },
            form_firstName_placeholder:{
                id: 'contactUs.form_firstName_placeholder',
                defaultMessage:'First name'
            },
            form_lastName_label:{
                id: 'contactUs.form_lastName_label',
                defaultMessage:'Last Name:'
            },
            form_lastName_placeholder:{
                id: 'contactUs.form_lastName_placeholder',
                defaultMessage:'Last name'
            },
            form_email_label:{
                id: 'contactUs.form_email_label',
                defaultMessage:'Email:'
            },
            form_email_placeholder:{
                id: 'contactUs.form_email_placeholder',
                defaultMessage:'user@server.com'
            },
            form_summary_label:{
                id: 'contactUs.form_summary_label',
                defaultMessage:'Summary:'
            },
            form_summary_placeholder:{
                id: 'contactUs.form_summary_placeholder',
                defaultMessage:'Please write us a one-sentence summary'
            },
            form_description_label:{
                id: 'contactUs.form_description_label',
                defaultMessage:'Description:'
            },
            form_description_placeholder:{
                id: 'contactUs.form_description_placeholder',
                defaultMessage:'Please give us more information about.'
            },
            form_button:{
                id: 'contactUs.form_button',
                defaultMessage:'Send Feedback'
            },
            send_swal_text:{
                id: 'contactUs.send_swal_text',
                defaultMessage:'Feedback sent. Thank you!'
            },
            send_swal_button:{
                id: 'contactUs.send_swal_button',
                defaultMessage:'Close'
            },
            send_swal_error_text: {
                id: 'contactUs.send_swal_error_text',
                defaultMessage:'An error occured while contacting us. Please try again later.'
            },
            send_swal_error_button:{
                id: 'contactUs.send_swal_error_button',
                defaultMessage:'Close'
            }
        });
    }
    componentDidMount(){
      //Load user info, if user is conected.
        if(this.props.UserProfileStore.username.length > 0)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username, id:this.props.UserProfileStore.userid}});
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            firstName :nextProps.UserProfileStore.user.fname,
            lastName:nextProps.UserProfileStore.user.lname,
            email: nextProps.UserProfileStore.user.email
        });
    }

    /**
     * Returns a list of options for the Report Type dropdown menu
     *
     * @returns {array}
     */
    getReportTypes() {
        return [
            {
                enum: 1,
                id: 'contactUs.typeOption_suggestion',
                defaultMessage: 'Suggestion'
            },{
                enum: 2,
                id: 'contactUs.typeOption_support',
                defaultMessage: 'Support Issue'
            },{
                enum: 3,
                id: 'contactUs.typeOption_account',
                defaultMessage: 'Account Issue'
            },{
                enum: 4,
                id: 'contactUs.typeOption_other',
                defaultMessage: 'Other'
            },
        ];
    }

    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }
    /*Using react-semantic-ui Inputs, when we assign them an initial value,
    the only way they can become editable is handling the onChange method.
    If the user is not logged, they don't receive an initial value,
    but the problem is the same, so we need to change by hand the value.
    Now, only not logged users can edit name, surname and email. If we want to
    allow all users to edit, we need to remove the if condition in each change method*/
    onFirstNameChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                firstName: data.value
            });
        }
    }
    onLastNameChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                lastName: data.value
            });
        }
    }
    onEmailChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                email: data.value
            });
        }
    }

    /* Screen readers doesn't read aloud the options when we use input+datalist. For this reason, we don't require that element to send the form
    checkType(){
        let noTypeError = true;
        //The following  code is needed if we implement the type of report using Dropdown
        //Begin Dropdown
        //if (this.typeContact.state.value === '' ){
        //    noTypeError = false;
        //    swal({
        //        title: this.context.intl.formatMessage(this.messages.swal_title),
        //        text: this.context.intl.formatMessage(this.messages.checkType_text),
        //        type: 'error',
        //        confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
        //        confirmButtonClass: 'ui olive button',
        //        allowEscapeKey: false,
        //        allowOutsideClick: false,
        //        buttonsStyling: false
        //    }).then((accepted) => {

        //        ReactDOM.findDOMNode(this.typeContact).focus();
        //    });
        //}
        //End Dropdown
        if (this.typeContact2.inputRef.value === '' ){
            noTypeError = false;
            swal({
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.checkType_text),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
                confirmButtonClass: 'ui olive button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            }).then((accepted) => {

                //ReactDOM.findDOMNode(this.typeContact).focus();
                this.typeContact2.focus();
            });
        }
        return noTypeError;

    }
    */
    checkEmail(){
        let noEmailError = true;
        let regExp = /\S+@\S+\.\S+/;
        if (this.state.email === '' || !regExp.test(this.state.email)){
            noEmailError = false;
            swal({
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.checkEmail_text),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
                confirmButtonClass: 'ui olive button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            }).then((accepted) => {

                this.emailContact.focus();
            });
        }
        return noEmailError;

    }
    checkSummary(){
        let noSummaryError = true;

        if (this.summaryContact.inputRef.value === ''){
            noSummaryError = false;
            swal({
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.checkSummary_text),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
                confirmButtonClass: 'ui olive button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            }).then((accepted) => {

                this.summaryContact.focus();
            });
        }
        return noSummaryError;
    }
    checkCaptcha(){
    // REturns true if everything is ok
        let noCaptchaError = true;
        if(this.state.grecaptcharesponse === undefined){
            noCaptchaError = false;
            swal({
                title:this.context.intl.formatMessage(this.messages.swal_title),
                text: this.context.intl.formatMessage(this.messages.checkCaptcha_text),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
                confirmButtonClass: 'ui olive button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            }).then((accepted) => {
                //recaptcha-checkbox-checkmark
                ReactDOM.findDOMNode(this.recaptcha).focus();
                //$('#recaptchaGoogleContact').focus();
            });
        }
        return noCaptchaError;
    }
    checkForm(){
    //Checks if requiered fields are ok.
    // Returns true if all are ok

        if(this.checkEmail())
            if(this.checkSummary())
                if(this.checkCaptcha())
                    return true;
        return false;
    }

    getSwalMessages(){
      //Get the messages which will show in the swal showed  when the form is sent
        return {
            title: this.context.intl.formatMessage(this.messages.swal_title),
            text: this.context.intl.formatMessage(this.messages.send_swal_text),
            confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_button),
            error_text: this.context.intl.formatMessage(this.messages.send_swal_error_text),
            error_confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_error_button)
        };
    }

    onSubmitHandler(event){
        //email, first name and last name are stored in the state
        //if we use a input list: type of report in this.typeContact2.inputRef.value
        event.preventDefault();
        if(this.checkForm()){
          //all data is ok. Send info
            let payload = {
                subject : this.summaryContact.inputRef.value,
                text : `First Name: ${this.state.firstName}\n`+
                    `Last Name: ${this.state.lastName}\n`+
                    `email: ${this.state.email}\n`+
                    `Feedback type: ${this.state.type} - ${this.getReportTypes().find((i) => i.enum === this.state.type).defaultMessage}\n`+
                    `Summary: ${this.summaryContact.inputRef.value}\n`+
                    `Description: ${this.descriptionContact.ref.value}`,
                swal_messages : this.getSwalMessages()
            };

            this.context.executeAction(sendContactForm,payload);
        }
    }

    render() {

        const recaptchaStyle = {display: 'inline-block'};

        return (
            <Container text>
                <Divider hidden />

                <Header as="h2">{this.context.intl.formatMessage(this.messages.swal_title)}</Header>
                <p>{this.context.intl.formatMessage(this.messages.form_explanation)}</p>

                  <Divider hidden />
                  <Segment attached="bottom" textAlign="left" >
                    <Header as='h3'>{this.context.intl.formatMessage(this.messages.form_subheader)}</Header>
                    <Form onSubmit={this.onSubmitHandler.bind(this)}>
                      <Form.Field key='1'>
                          <SWAutoComplete
                              required
                              label={this.context.intl.formatMessage(this.messages.form_type_label)}
                              id='type'
                              options={this.getReportTypes().map((type) => ({
                                  value: type.enum,
                                  name: this.context.intl.formatMessage(type),
                              }))}
                              onChange={this.handleInputChange}
                          />
                      </Form.Field>

                      <Form.Field key='2'>
                       <label htmlFor='firstNameContact'>{this.context.intl.formatMessage(this.messages.form_firstName_label)}</label>
                       <Input type='text' id='firstNameContact' name="firstNameContact" ref={(input) => {this.firstNameContact = input;}}
                         placeholder= {this.context.intl.formatMessage(this.messages.form_firstName_placeholder)}
                         value={this.state.firstName}
                         onChange ={this.onFirstNameChange.bind(this)}
                       />
                      </Form.Field>

                      <Form.Field key='3'>
                         <label htmlFor='lastNameContact'>{this.context.intl.formatMessage(this.messages.form_lastName_label)}</label>
                         <Input type='text' id='lastNameContact' name="lastNameContact" ref={(input) => {this.lastNameContact = input;}}
                         placeholder={this.context.intl.formatMessage(this.messages.form_lastName_placeholder)}
                         value={this.state.lastName}
                         onChange ={this.onLastNameChange.bind(this)}/>
                      </Form.Field>

                        <Form.Field
                            id='email'
                            control={Form.Input}
                            label={this.context.intl.formatMessage(this.messages.form_email_label)}
                            required
                            aria-required={true}
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            type='email'
                            error={Boolean(this.state.formValidationErrors.email)}
                        />

                      <Form.Field key='5'>
                        <label htmlFor='summaryContact'>{this.context.intl.formatMessage(this.messages.form_summary_label)}*</label>
                        <Input type='text' id='summaryContact' name="summaryContact" ref={(input) => {this.summaryContact = input;}}
                        placeholder={this.context.intl.formatMessage(this.messages.form_summary_placeholder)}
                        aria-required="true"  />
                      </Form.Field>

                      <Form.Field key='6'>
                        <label  htmlFor="descriptionContact"> {this.context.intl.formatMessage(this.messages.form_description_label)} </label>
                         <TextArea id='descriptionContact' name="descriptionContact" ref={(input) => {this.descriptionContact = input;}}
                          autoHeight
                          placeholder= {this.context.intl.formatMessage(this.messages.form_description_placeholder)} />
                      </Form.Field>

                      <Form.Field key='7'>
                        <input type="hidden" id="recaptchaContact" name="recaptchaContact"></input>
                        <ReCAPTCHA id="recaptchaGoogleContact" ref= {(recap) => {this.recaptcha = recap;}}
                         style={recaptchaStyle} sitekey={publicRecaptchaKey}
                         onChange={this.onRecaptchaChange.bind(this)}
                         aria-required="true" tabIndex="0"/>
                      </Form.Field>

                      <Form.Button color='blue' key='8'>
                        {this.context.intl.formatMessage(this.messages.form_button)}
                      </Form.Button>
                   </Form>
                   </Segment>

            </Container>

        );
    }
}

ContactUs.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ContactUs = connectToStores(ContactUs,[UserProfileStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default ContactUs;
