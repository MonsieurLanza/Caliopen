import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Tour from './components/Tour';
import Button from '../../../../components/Button';

import './style.scss';

class TakeATour extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
  };
  state = {
    isTourActive: false,
  };

  handleToggleTour = () => {
    this.setState(prevState => ({ isTourActive: !prevState.isTourActive }));
  }

  handleChangeStep = (step) => {
    this.setState({ tourStep: step });
  }

  handleclose = () => {
    this.setState({ isTourActive: false });
  }

  render() {
    const { i18n } = this.props;

    const steps = [
      {
        selector: '.s-timeline',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.intro.title">Welcome!</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n._('take-a-tour.step.intro.content', { defaults: '<p>With using  Caliopen, you can access to all of your private messages (Email, and more to come) through a single login.</p><p>Now, take a look at our main features, such as unified message management, intuitive search and more!</p>' }) }} />
          </div>
        ),
        position: 'center',
      },
      {
        selector: '.l-header__m-search-field',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.search.title">Intuitive search</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n._('take-a-tour.step.search.content', { defaults: '<p>Every search can include filters. All of the unencrypted data can be searched.</p><p>Here you can search everything in your messages and contacts.</p>' }) }} />
          </div>
        ),
      },
      {
        selector: '.l-header__user',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.user-menu.title">Account menu</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n._('take-a-tour.step.user-menu.content', { defaults: '<p>Keep up-to-date your account information and manage your settings from here!</p><p>Customize your application in your settings.</p>' }) }} />
          </div>
        ),
        position: 'bottom',
      },
      {
        selector: '.l-call-to-action',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.call-to-action.title">Create quickly</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n._('take-a-tour.step.call-to-action.content', { defaults: '<p>Create on the fly a new message or a new contact.</p><p>All you need to begin is here.</p>' }) }} />
          </div>
        ),
      },
      {
        selector: '#toggle-IL_navigation_slider_dropdown',
        content: (
          <div>
            <h2><Trans id="take-a-tour.step.importance-slider.title">Importance level</Trans></h2>
            <div dangerouslySetInnerHTML={{ __html: i18n._('take-a-tour.step.importance-slider.content', { defaults: '<p>This slider will help you to hide or show some messages depending on their importance level.</p><p>Lower the top slider to show only spams or upper the bottom one to show direct messages.</p>' }) }} />
          </div>
        ),
      },
    ];

    return (
      <Button onClick={this.handleToggleTour} icon="question-circle" display="expanded" className="m-take-a-tour__icon">
        <span className="show-for-sr"><Trans id="take-a-tour.action.toggle">Take a tour</Trans></span>
        <Tour
          isOpen={this.state.isTourActive}
          step={this.state.tourStep}
          onRequestClose={this.handleclose}
          steps={steps}
          badgeContent={(current, total) => (<Trans id="take-a-tour.current-step">Take a tour ({current} of {total})</Trans>)}
          showNavigation={false}
          skipButton={i18n._('take-a-tour.action.skip', { defaults: 'Skip' })}
          prevButton={i18n._('take-a-tour.action.prev', { defaults: 'Previous' })}
          nextButton={i18n._('take-a-tour.action.next', { defaults: 'Next' })}
          lastStepNextButton={i18n._('take-a-tour.action.last-step', { defaults: 'Finish' })}
          closeButton={i18n._('take-a-tour.action.close', { defaults: 'Close' })}
        />
      </Button>
    );
  }
}

export default TakeATour;
