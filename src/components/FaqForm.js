import React, { PureComponent } from 'react';
import BasicFormModal from './BasicFormModal';
import TimeNow from './TimeNow';
import TabA from './TabA';
import LinkButton from './LinkButton';

const FaqH = props => (
  <h5
    style={{
      color: 'wheat',
      borderBottom: 'solid thin gray',
    }}
  >
    {props.children}
  </h5>
);

class FaqForm extends PureComponent {
  render() {
    const entryPoint = <LinkButton>FAQ</LinkButton>;
    const header = 'Frequently Asked Questions';
    const cancelText = 'Close';
    const resetForm = () => {};
    const onExit = this.props.onExit;
    const onFormSubmit = undefined;
    return (
      <BasicFormModal
        {...{ entryPoint, header, cancelText, resetForm, onFormSubmit, onExit }}
      >
        <FaqH>What is this?</FaqH>
        <p>
          If you don&apos;t know what this is, I honestly have no idea how you
          ended up here. You can stay though, it&apos;s cool. This is a swiss
          style tourament manager I wrote for my friend Bruce to help him run
          Magic the Gathering (MtG) tournaments at a local library.
        </p>
        <FaqH>Where am I?</FaqH>
        <p>
          I don&apos;t know, people don&apos;t like it when websites request
          their location. Look around.
        </p>
        <FaqH>Why is it called Hera2?</FaqH>
        <p>
          Originally I was going to call it WerA for WER Assistant, since WER is
          the de facto MtG tournament manager. But Hera is close enough and has
          sort of a mythological ring to it. The 2 is because well, that first
          one was a mess.
        </p>
        <FaqH>When am I?</FaqH>
        I&apos;m starting to think you&apos;re not really here for information
        about the site. This current time is <TimeNow />.
        <p />
        <FaqH>I noticed a bug, how do I report it?</FaqH>
        <p>
          If you found an problem, please report it by filing an issue on GitHub{' '}
          <TabA href="https://github.com/mbb70/hera2/issues">here</TabA>.
        </p>
        <FaqH>No, what YEAR is it?</FaqH>
        <p>
          I already told you that, it&apos;s <TimeNow yearOnly />. If you have
          other Jumanji related questions, I believe Kirsten Dunst is still
          alive.
        </p>
        <FaqH>
          I noticed a feature I want isn&apos;t available, how do I request it?
        </FaqH>
        <p>
          If you have a feature you want, please request it by filing an issue
          on GitHub{' '}
          <TabA href="https://github.com/mbb70/hera2/issues">here</TabA> with
          the &lsquo;enhancement&rsquo; flag added. If I have time I might do
          it.
        </p>
        <FaqH>OH GOD WHAT HAVE I BECOME?</FaqH>
        <p>
          Bruh, you&apos;ve changed. We used to be cool, we used to have fun.
          Now? I just don&apos;t know. Take some time to focus on yourself, work
          to become who you were. We all miss you, the real you.
        </p>
        <FaqH>Who are you?</FaqH>
        <p>Matt Brown, a guy!</p>
      </BasicFormModal>
    );
  }
}

export default FaqForm;
