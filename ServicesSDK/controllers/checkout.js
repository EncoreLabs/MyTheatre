const pageTitle = 'Booking page';

const createBooking = (inputs, template, callback, checkoutService) => {
  const { channelId, reference, bookingSettings } = inputs;
  const { billingAddress, redirectUrl, shopper, deliveryMethod, agentDetails, paymentType } = bookingSettings;

  checkoutService.createOrder({
    channelId,
    reference,
    billingAddress,
    redirectUrl,
    shopper,
    deliveryMethod,
    paymentType,
  }).then(data => {
    const paymentId = data.paymentId || 'on-account-booking';
    const bookingType = data.paymentId ? 'not on account' : 'on account';
    const messages = [`Booking ${reference} was successfully confirmed (${bookingType}).`];

    checkoutService.confirmBooking(
      reference,
      channelId,
      paymentId,
      agentDetails
    ).then(({ result }) => {
      callback.render(template, {
        result,
        title: pageTitle,
        shopper,
        billingAddress,
        messages,
      });
    }).catch((err) => {
      callback.render('error', {
        title: pageTitle,
        messages: [err.message],
      })
    });
  }).catch((err) => {
    callback.render('error', {
      title: pageTitle,
      messages: [err.message],
    })
  });
};

module.exports.createBooking = createBooking;
