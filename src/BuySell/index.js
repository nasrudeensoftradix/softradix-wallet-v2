import transakSDK from "@transak/transak-sdk";

export const initializeTransak = () => {
  let transak = new transakSDK({
    apiKey: "81b832fe-ae09-4963-ba47-4530e3feab41", // (Required)
    environment: "STAGING", // (Required)
    // .....
    // For the full list of customisation options check the link above
  });

  transak.init();

  // To get all the events
  transak.on(transak.ALL_EVENTS, (data) => {
    console.log(data);
  });

  // This will trigger when the user closed the widget
  transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
    transak.close();
  });

  // This will trigger when the user marks payment is made
  transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transak.close();
  });
};
