import Link from 'next/link';
import page from '../../components/page';
import React from 'react';
import quoteStore from '../../datastores/quote';
import axios from 'axios';

export default page(class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: false };
  }

  async loadQuote() {
    this.setState({ loading: true });
    try {
      let result = (await axios.post('/api/quote', this.props.quote)).data;
      quoteStore.update(state => ({ ...state, result }));
      this.setState({ error: false });
    }
    catch (e) {
      this.setState({ error: true });
    }
    this.setState({ loading: false });
  }

  async componentDidMount() {
    if (!quoteStore.isValid) {
      await this.loadQuote();
    }
  }

  get formattedPremium() {
    if (this.props.quote.result) {
      const amount = this.props.quote.result.premium;
      return Number(amount / 100).toLocaleString().replace(/,/g, ' ');
    } else {
      return '';
    }
  }

  get formattedSumAssured() {
    const amount = this.props.quote.sumAssured;
    return Number(amount).toLocaleString().replace(/,/g, ' ');
  }

  render() {
    return (
      <section className='section'>
        <div className={`pageloader ${this.state.loading ? 'is-active' : ''}`}><span className='title'>Fetching Quote</span></div>
        {this.state.error && <div className='container content'>
          <h1 className='title is-3'>Oh no!</h1>
          <p>Something went wrong while generating your quote</p>
          <a className='wpwl-button wpwl-button-pay' style={{ textDecoration: 'none' }} onClick={this.loadQuote.bind(this)}>Try again</a>
        </div>}
        {!this.state.error && <div className='container content'>
          <div className='columns is-reversed-mobile'>
            <div className='column'>
              <div className='pricing-table'>
                <div style={{ marginTop: 0 }} className='pricing-plan is-primary'>
                  <div className='plan-header'>R {this.formattedSumAssured} cover</div>
                  <div className='plan-price'><span className='plan-price-amount'><span className='plan-price-currency'>R</span>{this.formattedPremium}</span>/month</div>
                  <div className='plan-items'>
                    <div className='plan-item'>Early Warning Network</div>
                    <div className='plan-item'>Extraction Team</div>
                    <div className='plan-item'>Security Consultants</div>
                    <div className='plan-item'>24 Hour Support</div>
                  </div>
                  <div className='plan-footer'>
                    <Link prefetch href='/checkout'>
                      <a>
                        <button className='button is-fullwidth'>
                          <span className='icon'><i className='fa fa-shopping-cart' /></span>&nbsp; Checkout
                        </button>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} className='column content is-two-thirds'>
              <div style={{ flex: 1 }}>
                <h1 className='title is-3'>Get Dinosured!</h1>
                <p>
                  Your personalised quote for <strong>R {this.formattedSumAssured}</strong> cover
                  at <strong>R {this.formattedPremium}</strong> per month is valid for the
                  next 24 hours.
                </p>
                <p>
                  Dinosure offers <em>instant</em> cover. If you're stuck on an island, and there are raptors around, we can help you out <sup><a href='#fn1' id='ref1'>1</a></sup>.
                  Our<span className='icon'><i className='fa fa-lock' /></span>secure checkout is simple and requires only a valid credit card.
                </p>
                <p>
                  <Link prefetch href='/checkout'><a>Click here</a></Link> to start the checkout process and get protected.
                </p>
              </div>
              <div style={{ flex: 0.1 }}>
                <sup id='fn1'>1. Terms and conditions apply<a href='#ref1' title='Jump back to footnote 1 in the text.'>↩</a></sup>
              </div>
            </div>
          </div>
        </div>}

      </section>
    );
  }
}, {
    datastores: { quote: quoteStore }
  }
);
