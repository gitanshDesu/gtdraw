import { Resend } from "resend";
import * as crypto from "crypto";
import { MailType } from "../types/index";
import { CustomError } from "./CustomError";
import { prisma } from "@gtdraw/db";
import { RESEND_API_KEY, RESEND_MAIL } from "../config/index";

const resend = new Resend(RESEND_API_KEY!);

const digits = "23456789"; // avoid numbers 0,1 which can be misread.

const alphabets = "abcdefghijkmnpqrstABCDEFGHJKLMNPQRSTUVWXYZ"; // avoid alphabets which can be misread

const specialChars = "#!&@";

export interface GenerateCodeOptions {
  digits?: boolean;
  alphabets?: boolean;
  specialChars?: boolean;
}
export const generateVerificationCode = (
  length: number = 8,
  options: GenerateCodeOptions
) => {
  const {
    digits: includeDigits = true,
    alphabets: includeAlphabets = true,
    specialChars: includeSpecialChars = true,
  } = options;
  const allowedChars =
    (includeDigits ? digits : "") +
    (includeAlphabets ? alphabets : "") +
    (includeSpecialChars ? specialChars : "");
  if (!allowedChars) {
    throw new Error(
      "No Characters available to generate verification code. Please adujst the options!"
    );
  }
  let verificationCode = "";
  while (verificationCode.length < length) {
    const charIndex = crypto.randomInt(0, allowedChars.length);
    verificationCode += allowedChars[charIndex];
  }
  return verificationCode;
};

export const sendMail = async (email: string, type: MailType) => {
  try {
    //generate verification code and send mail
    const verificationCode = generateVerificationCode(8, {
      digits: true,
      alphabets: true,
      specialChars: true,
    });

    const subject =
      type === MailType.VERIFY ? `Verification Email` : `Reset Password`;

    const html = `
            <p> 
            Enter this verification Code to ${type === "VERIFY" ? "Verify your Email" : "Reset Your Password"}
            <br>
            <strong> Verification Code </strong> : ${verificationCode}
            <br>
            <strong><em> This code will expire in 1 hour! </em></strong>
            </p>
            `;

    const response = await resend.emails.send({
      from: RESEND_MAIL!,
      to: email,
      subject: subject,
      html: html,
    });

    //After verification code is sent save in DB with verification code expiry and return response
    const verificationCodeExpiry = new Date(Date.now() + 3600000);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        verificationCode: verificationCode,
        verificationCodeExpiry: verificationCodeExpiry,
      },
    });
    return response;
  } catch (error) {
    console.error(
      `Error Occurred while sending mail from send mail method:\n ${error}`
    );
    throw new CustomError(500, "Error Occurred while Sending Email!");
  }
};
