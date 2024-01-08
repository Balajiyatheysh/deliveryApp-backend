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

    const accountSid = "AC74f291eea5b58ffb9ca7dac39f2225b5";

    const authToken = "1c553cf25ae0e9017369eb1b447e435f";

    const client = require("twilio")(accountSid, authToken);

    const response = await client.messages.create({

      body: `Your OTP is ${otp}`,
      from: "+17176872119",
      to: `+91${toPhoneNumber}`, // recipient phone number // Add country before the number

    });

    return response;

  } catch (error) {

    console.log(error)

  }
};
