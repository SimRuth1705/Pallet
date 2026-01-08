import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


function PaypalButton({ amount, onSuccess, onError }) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AT2VwR--Kv1119zpSgGEaqpU0R809B_MyI293yVGb2MHgmSlnm8sWgXzl_xrcP7-xJMQYdVZw5acEOYj",
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(), 
                  currency_code: "USD" 
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
             onSuccess(details); 
          });
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          onError(err);
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PaypalButton;