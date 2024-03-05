export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 9000000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return {
    otp,
    expiry,
  };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {

  try {

    const accountSid = `${process.env.ACCOUNT_SID}`;

    const authToken = `${process.env.AUTH_TOKEN}`;

    const client = require("twilio")(accountSid, authToken);

    const response = await client.messages.create({

      body: `Your OTP is ${otp}`,
      from: `${process.env.PHONE_NUMBER}`,
      to: `+91${toPhoneNumber}`, // recipient phone number // Add country before the number

    });

    return response;

  } catch (error) {
    console.log(error)
  }
};
