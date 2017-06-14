import React from 'react';
import addQuestion from '../../../../actions/questions/addQuestion';

class ContentQuestionAdd extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            difficulty: 'easy',
            question: '',
            response1: '',
            response2: '',
            response3: '',
            response4: '',
            isResponseCorrect1: true,
            isResponseCorrect2: false,
            isResponseCorrect3: false,
            isResponseCorrect4: false,
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
    }

    handleButtonClick() {
        let dummyQuestion = {
            question: {
                id: 120,
                title: 'Brand new question',
                username: 'Ilya B.',
                userID: 66,
                difficulty: 2,
                Date: 'yesterday',
                answers: [{answer: 'Ja', correct: true, explanation: 'Obvious'},
                          {answer: 'Nein', correct: false, explanation: ''},
                          {answer: 'Vielleicht', correct: true, explanation: 'May the power comes with you!'},
                          {answer: 'Ich kenne das nicht', correct: false, explanation: ''}]
            },
        };
        context.executeAction(addQuestion, dummyQuestion);
        this.props.onButtonClick();
    }

    handleChange(changeEvent) {
        this.setState({
            [changeEvent.target.name]: changeEvent.target.value,
        });
    }

    handleAnswerChange(changeEvent) {
        this.setState({
            [changeEvent.target.name]: changeEvent.target.checked,
        });
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }


    render() {

        const getRadioButtons = () => {
            let buttons = [];
            let levels = ['Easy', 'Moderate', 'Hard'];

            for (let i = 0; i < 3; i++) {
                buttons.push(
            <div key={i} className="field">
              <div className="ui radio checkbox">
                <input
                  type="radio"
                  id={levels[i].toLowerCase()}
                  name='difficulty'
                  tabIndex={0}
                  className="hidden"
                  value={levels[i].toLowerCase()}
                  checked={this.state.difficulty === levels[i].toLowerCase()}
                  onChange={this.handleChange}
                />
              <label htmlFor={levels[i].toLowerCase()}>{levels[i]}</label>
              </div>
            </div>
          );
            }
            return buttons;
        };

        const getAnswerChoiceFields = () => {
            let answers = [];
            for (let i = 0; i < 4; i++) {
                answers.push(
            <div key={i} className="inline field">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  id={`box${i+1}`}
                  name={`isResponseCorrect${i+1}`}
                  tabIndex={0}
                  checked={this.state[`isResponseCorrect${i+1}`]}
                  onChange={this.handleAnswerChange} />
                <label htmlFor={`answer${i+1}`} />
              </div>
              <input
                type="text"
                style={{width: 680}}
                name={`response${i+1}`}
                id={`response${i+1}`}
                value={this.state[`response${i+1}`]}
                onChange={this.handleChange} />
              <label htmlFor={`response${i+1}`} />
            </div>
          );
            }
            return answers;
        };

        return (
      <div
        className="ui segment attached"
        data-reactid={636}>
        <div
          className="ui bottom attached"
          data-reactid={637}>
          <div className="ui vertical segment">
            <div className="ui two column stackable grid">
              <div className="column">
                <h3 className="ui header">
                  Question 1 of 5
                </h3>
              </div>
              <div className="column right aligned">
                <button className="ui right floated compact button blue">
                  <i className=" wizard icon" data-reactid={640} />
                </button>
              </div>
            </div>
          </div>
          <div className="ui padded segment">
            <form className="ui form" onSubmit={this.handleSubmit}>
              <div className="two fields">
                <div className="required field">
                  <label htmlFor="question">Question</label>
                  <textarea
                    rows={3}
                    name="question"
                    id="question"
                    aria-required="true"
                    onChange={this.handleChange}
                    value={this.state.question}
                  >
                  </textarea>
                </div>
                <div className="ui grouped fields">
                  <fieldset>
                    <legend>Difficulty</legend>
                    <div className="inline fields">
                      {getRadioButtons()}
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="ui grouped fields">
                <fieldset>
                  <legend>
                    Answer Choices
                  </legend>
                  {getAnswerChoiceFields()}
                </fieldset>
              </div>
              <div className="field">
                <label htmlFor="explanation">
                  Explanation (optional)
                </label>
                <textarea rows={2} id="explanation" />
              </div>
              <div className="field">
                <div className="ui container">
                  <div className="ui right floated buttons">
                    <button type='button' className="ui primary button" onClick={this.handleButtonClick}>Save</button>
                    <button type='button' className="ui secondary button" onClick={this.handleButtonClick}>Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
        );
    }
}

ContentQuestionAdd.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionAdd;
