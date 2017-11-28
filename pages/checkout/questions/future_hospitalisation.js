import page from '../../../components/page';
import applicationStore from '../../../datastores/application';
import Choice from '../../../components/choice';
import Router from 'next/router';
import Steps from '../../../components/checkout-steps';

const disqualified = () => Router.push({ pathname: '/do-not-qualify', query: { reason: 'future_hospitalisation' } });
const next = () => Router.push('/checkout/payment/summary');

export default page(({ quote }) =>
  <section className='section'>
    <div className='has-text-centered'>
      <h1 className='title is-5'>Question 4</h1>
    </div>
    <Choice
      instructions='Other than childbirth or pregnancy, I am not planning on seeing any medical professional in the next 8 weeks.'
      onLeft={next} leftOption='Yes'
      onRight={disqualified} rightOption='No'
    />
  </section>,
  {
    footer: () =>
      <section className='section'>
        <Steps currentStep={1} />
      </section>,
    datastores: { application: applicationStore }
  }
);