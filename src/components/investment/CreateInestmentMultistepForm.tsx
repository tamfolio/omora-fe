"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Balances from "./Balances";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { CircleQuestionMark, TriangleAlert } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

type Step = InvestmentType;
type InvestmentType = "recurring" | "one-time" | null;
const userBalance = 1000;

interface FormValues {
  investment: InvestmentType;
  duration: string | null;
  totalAmount: number | null; // renamed from oneTimeAmount
  bitcoinProfile: boolean;
  growthProfile: boolean;
  conservativeProfile: boolean;
  termsAndConditions: boolean;
}

const validationSchema = Yup.object({
  investment: Yup.string()
    .nullable()
    .required("Please select an investment type"),
  duration: Yup.string().nullable().required("Please select a duration"),
  totalAmount: Yup.number()
    .nullable()
    .required("Amount is required")
    .min(1, "Must be greater than 0")
    .max(userBalance, `Insufficient balance. You only have ${userBalance} USDC`),
  termsAndConditions: Yup.boolean().oneOf([true], "You must accept the risks"),

  categories: Yup.object().test(
    "at-least-one-category",
    "Please select at least one category",
    function () {
      const { conservativeProfile, bitcoinProfile, growthProfile } = this.parent;
      return conservativeProfile || bitcoinProfile || growthProfile;
    }
  ),
});


export default function CreateInvestmentMultiStepForm() {
  const [investmentType, setInvestmentType] = useState<Step>("one-time");
  const [isOpen, setIsOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);


  const getDurationInDays = (duration: string | undefined) => {
  if (!duration) return 0;
  const match = duration.match(/\d+/); // find first number
  return match ? parseInt(match[0], 10) : 0;
};

  const initialValues: FormValues = {
  investment: "one-time",
  duration: null,
  totalAmount: null,
  bitcoinProfile: false,
  growthProfile: false,
  conservativeProfile: false,
  termsAndConditions: false,
};

const successMessage = submittedData
  ? `You have successfully Invested ${submittedData.totalAmount} USDC to ${
      [
        submittedData.conservativeProfile ? "Conservative ETF" : null,
        submittedData.bitcoinProfile ? "Bitcoin ETF" : null,
        submittedData.growthProfile ? "Growth ETF" : null,
      ]
        .filter(Boolean)
        .join(", ")
    }. The investment will reflect in your investment history.`
  : "";


  return (
    <div className="relative h-full bg-gradient-to-b from-[#79B7BC]/5 via-[#AEDCE0]/5 to-[#FFFFFF] px-[112px]">
      <div
        className={`"pb-10"}`}
      >
        <div className="pt-16">
          <Balances />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          enableReinitialize
          validateOnChange={false}
          onSubmit={(values) => {
            setSubmittedData(values);
            setIsOpen(true);
          }}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => {
            // categories summary
            const selectedCategories = [
              values.bitcoinProfile ? "Bitcoin ETF" : null,
              values.growthProfile ? "Growth ETF" : null,
              values.conservativeProfile ? "Conservative ETF" : null,
            ]
              .filter(Boolean)
              .join(", ");

            // Calculate category breakdown for one-time
            const categories: string[] = [];
            if (values.bitcoinProfile) categories.push("Bitcoin ETF");
            if (values.growthProfile) categories.push("Growth ETF");
            if (values.conservativeProfile) categories.push("Conservative ETF");

            let breakdown: { category: string; amount: number }[] = [];
            if ((investmentType === "one-time" || investmentType === "recurring") && values.totalAmount && categories.length > 0) {
              const perCategory = values.totalAmount / categories.length;
              breakdown = categories.map((cat) => ({
                category: cat,
                amount: perCategory,
              }));
            }


            // Daily deduction for recurring
            let dailyDeduction: number | null = null;
            if (investmentType === "recurring" && values.totalAmount && values.duration) {
              const days = parseInt(values.duration); // "90 days" → 90
              dailyDeduction = values.totalAmount / days;
            }

            return (
              <TooltipProvider>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-3 mt-8 mb-[128px]">
                  <div className="md:col-span-2">
                    <Form className="p-5 rounded-[12px] border border-[#A4A7AE] bg-[#FDFDFD] space-y-5">
                      {/* Investment Type */}
                      <div className="p-5 border border-[#E9EAEB] rounded-[12px] bg-white">
                        <div className="flex items-center gap-1">
                          <div className="w-full">
                            <div className="flex items-center gap-1 mb-[18px]">
                              <h2 className="text-[#414651] font-medium">
                                Investment Type
                              </h2>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleQuestionMark
                                    size={16}
                                    color="#A4A7AE"
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                  <p>
                                    Choose between recurring or onetime
                                    investment
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="grid grid-cols-1  h-fit border rounded-[8px] w-full md:grid-cols-2 border-[#E9EAEB]">
                              <div
                                onClick={() => setInvestmentType("one-time")}
                                className={`w-full text-center px-3 py-2 text-[#414651] cursor-pointer bg-[#FAFAFA] ${
                                  investmentType === "one-time"
                                    ? "bg-white border rounded-[8px]"
                                    : ""
                                }`}
                              >
                                One-time Investment
                              </div>
                              <div
                                onClick={() => setInvestmentType("recurring")}
                                className={`w-full text-center px-3 py-2 text-[#414651] cursor-pointer bg-[#FAFAFA] ${
                                  investmentType === "recurring"
                                    ? "bg-white border rounded-[8px]"
                                    : ""
                                }`}
                              >
                                Recurring Investment
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="p-5 border border-[#E9EAEB] rounded-[12px] bg-white">
                        <div className="flex items-center gap-1">
                          <div className="w-full">
                            <div className="flex items-center gap-1 mb-[18px]">
                              <h2 className="text-[#414651] font-medium">
                                Select Duration
                              </h2>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleQuestionMark
                                    size={16}
                                    color="#A4A7AE"
                                  />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                  <h3 className="font-semibold text-[#181D27]">
                                    Duration
                                  </h3>
                                  <p>
                                    You prefer stability over rapid gains. Your
                                    portfolio focuses on top 5 digital assets,
                                    minimizing volatility and downside risk.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="grid gap-1 grid-cols-2 lg:grid-cols-4 w-full">
                              {[
                                "90 days",
                                "180 days",
                                "270 days",
                                "360 days",
                              ].map((d) => (
                                <Button
                                  key={d}
                                  type="button"
                                  onClick={() => setFieldValue("duration", d)}
                                  className={`py-2 px-3 w-full hover:bg-[#008B99] hover:text-white rounded-[8px] border border-[#D5D7DA] text-[#414651] text-sm font-semibold ${
                                    values.duration === d
                                      ? "bg-[#008B99] text-white"
                                      : "bg-transparent"
                                  }`}
                                >
                                  {d}
                                </Button>
                              ))}
                            </div>
                            <ErrorMessage
                              name="duration"
                              component="div"
                              className="text-[#F04438] text-sm mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="p-5 border border-[#E9EAEB] rounded-[12px] bg-white">
                        <div>
                          <div className="flex items-center gap-1 mb-[18px]">
                            <h2 className="text-[#414651] font-medium">
                              Enter{" "}
                              {investmentType === "one-time"
                                ? "Amount"
                                : "Total Amount"}
                            </h2>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CircleQuestionMark size={16} color="#A4A7AE" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                <h3 className="font-semibold text-[#181D27]">
                                  Amount
                                </h3>
                                <p>
                                  You prefer stability over rapid gains. Your
                                  portfolio focuses on top 5 digital assets,
                                  minimizing volatility and downside risk.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>

                          <div>
                            <label
                              htmlFor="totalAmount"
                              className="block font-medium text-[#414651] text-sm mb-1.5"
                            >
                              Total Amount (USDC)
                            </label>
                            <Field
                              placeholder="250"
                              min={0}
                              as={Input}
                              type="number"
                              name="totalAmount"
                              className={cn(
                                "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                errors.totalAmount && touched.totalAmount
                                  ? "border-[#F04438]"
                                  : ""
                              )}
                            />
                            {investmentType === "recurring" &&
                              dailyDeduction &&
                              values.duration && (
                                <div className="text-[#414651] text-sm mt-[6px]">
                                  Daily Debit: {dailyDeduction.toFixed(2)} USDC
                                  over {values.duration}
                                </div>
                              )}
                            <ErrorMessage name="totalAmount">
                          {(msg) => (
                            <div className="flex items-center gap-1 text-[#D92D20] text-sm mt-1">
                              <TriangleAlert size={14} className="shrink-0" />
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                          </div>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="p-5 border border-[#E9EAEB] rounded-[12px] bg-white">
                        <div>
                          <div className="flex items-center gap-1 mb-[18px]">
                            <h2 className="text-[#414651] font-medium">
                              Choose Categories
                            </h2>
                          </div>
                          <div className="flex flex-col gap-4">
                            {/* Conservative ETF */}
                            <label className="flex gap-2 text-sm text-[#414651]">
                              <Checkbox
                                checked={values.conservativeProfile}
                                onCheckedChange={(checked: boolean) =>
                                  setFieldValue("conservativeProfile", checked)
                                }
                                className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                              />
                              <div className="-mt-[2px]">
                                <span className="flex items-center gap-1 text-[#181D27] text-sm">
                                  <span className="font-bold">
                                    Conservative ETF - Balanced mix
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <CircleQuestionMark
                                        size={16}
                                        color="#A4A7AE"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                      <h3 className="font-semibold text-[#181D27]">
                                        Conservative ETF
                                      </h3>
                                      <p>
                                        You prefer stability over rapid gains.
                                        Your portfolio focuses on top 5 digital
                                        assets, minimizing volatility and
                                        downside risk.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                                {investmentType === "recurring" &&
                                  values.duration && (
                                    <div className="text-[#535862] text-xs mt-1">
                                      Daily Debit:{" "}
                                      {values.conservativeProfile
                                        ? `${(
                                            (breakdown.find(
                                              (b) =>
                                                b.category ===
                                                "Conservative ETF"
                                            )?.amount || 0) /
                                            getDurationInDays(values.duration)
                                          ).toFixed(2)} USDC`
                                        : "--- USDC"}
                                    </div>
                                  )}
                              </div>
                            </label>

                            {/* Bitcoin ETF */}
                            <label className="flex gap-2 text-sm text-[#414651]">
                              <Checkbox
                                checked={values.bitcoinProfile}
                                onCheckedChange={(checked: boolean) =>
                                  setFieldValue("bitcoinProfile", checked)
                                }
                                className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                              />
                              <div className="-mt-[2px]">
                                <span className="flex items-center gap-1 text-[#181D27] text-sm">
                                  <span className="font-semibold">
                                    Bitcoin ETF - Pure BTC exposure
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <CircleQuestionMark
                                        size={16}
                                        color="#A4A7AE"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                      <h3 className="font-semibold text-[#181D27]">
                                        Bitcoin ETF
                                      </h3>
                                      <p>
                                        You&apos;re open to moderate risk for
                                        moderate returns. All your investments
                                        are on Bitcoin, aiming for steady growth
                                        with controlled exposure.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                                {investmentType === "recurring" &&
                                  values.duration && (
                                    <div className="text-[#535862] text-xs mt-1">
                                      Daily Debit:{" "}
                                      {values.bitcoinProfile
                                        ? `${(
                                            (breakdown.find(
                                              (b) =>
                                                b.category === "Bitcoin ETF"
                                            )?.amount || 0) /
                                            getDurationInDays(values.duration)
                                          ).toFixed(2)} USDC`
                                        : "--- USDC"}
                                    </div>
                                  )}
                              </div>
                            </label>

                            {/* Growth ETF */}
                            <label className="flex gap-2 text-sm text-[#414651]">
                              <Checkbox
                                checked={values.growthProfile}
                                onCheckedChange={(checked: boolean) =>
                                  setFieldValue("growthProfile", checked)
                                }
                                className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                              />
                              <div className="-mt-[2px]">
                                <span className="flex items-center gap-1 text-[#181D27] text-sm">
                                  <span className="font-semibold">
                                    Growth ETF - Aggressive altcoin mix
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <CircleQuestionMark
                                        size={16}
                                        color="#A4A7AE"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#F5F5F5] max-w-[235px] py-2 px-3 shadow-sm rounded-[12px] text-[#717680] text-xs">
                                      <h3 className="font-semibold text-[#181D27]">
                                        Growth ETF
                                      </h3>
                                      <p className="!font-normal">
                                        You seek high returns and accept higher
                                        risk. Your portfolio will concentrate on
                                        10 high-risk tokens. Expect higher
                                        volatility and potential for larger
                                        swings.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                                {investmentType === "recurring" &&
                                  values.duration && (
                                    <div className="text-[#535862] text-xs mt-1">
                                      Daily Debit:{" "}
                                      {values.growthProfile
                                        ? `${(
                                            (breakdown.find(
                                              (b) => b.category === "Growth ETF"
                                            )?.amount || 0) /
                                            getDurationInDays(values.duration)
                                          ).toFixed(2)} USDC`
                                        : "--- USDC"}
                                    </div>
                                  )}
                              </div>
                            </label>
                          </div>
                        </div>

                        <ErrorMessage
                          name="categories"
                          component="div"
                          className="text-[#F04438] text-sm mt-1"
                        />
                      </div>

                      {/* Summary */}
                      <div className="p-5 border border-[#E9EAEB] rounded-[12px] bg-white">
                        <div>
                          <div className="flex items-center gap-1 mb-[18px]">
                            <h2 className="text-[#414651] font-medium">
                              Summary
                            </h2>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <span className="text-[#181D27] font-semibold text-sm">
                              Duration:
                            </span>
                            <span className="text-[#181D27] font-medium text-sm">
                              {values.duration || "None selected"}
                            </span>

                            <span className="text-[#181D27] font-semibold text-sm">
                              Categories:
                            </span>
                            <span className="text-[#181D27] font-medium text-sm">
                              {selectedCategories || "None Selected"}
                            </span>

                            {(investmentType === "one-time" ||
                              investmentType === "recurring") &&
                              categories.length > 0 && (
                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                  {breakdown.map((b) => (
                                    <React.Fragment key={b.category}>
                                      <span className="text-[#181D27] pl-6 font-semibold text-sm">
                                        {b.category}:
                                      </span>
                                      <span className="text-[#181D27] font-medium text-sm">
                                        {b.amount.toFixed(2)} USDC
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}

                            {/* Total Committed (for both one-time and recurring) */}
                            {(investmentType === "one-time" ||
                              investmentType === "recurring") && (
                              <>
                                <span className="text-[#181D27] font-semibold text-sm">
                                  Total Committed:
                                </span>
                                <span className="text-[#181D27] font-medium text-sm">
                                  {values.totalAmount
                                    ? `${values.totalAmount} USDC`
                                    : "--- USDC"}
                                </span>
                              </>
                            )}

                            {/* Daily Deduction (only for recurring) */}
                            {investmentType === "recurring" &&
                              dailyDeduction && (
                                <>
                                  <span className="text-[#181D27] font-semibold text-sm">
                                    Daily Debit:
                                  </span>
                                  <span className="text-[#181D27] font-medium text-sm">
                                    {dailyDeduction.toFixed(2)} USDC
                                  </span>
                                </>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div>
                        <div className="flex items-start gap-2">
                          <Checkbox
                            checked={values.termsAndConditions}
                            onCheckedChange={(checked: boolean) =>
                              setFieldValue("termsAndConditions", checked)
                            }
                            id="termsAndConditions"
                            className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                          />
                          <p className="text-[#414651] text-sm -mt-[2px]">
                            I understand this is a cryptocurrency investment and
                            accept the associated risks, including potential
                            capital loss due to market volatility
                          </p>
                        </div>
                        <ErrorMessage
                          name="termsAndConditions"
                          component="div"
                          className="text-[#F04438] text-sm mt-1"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !values.totalAmount ||
                          !values.duration ||
                          !values.termsAndConditions ||
                          !(
                            values.bitcoinProfile ||
                            values.growthProfile ||
                            values.conservativeProfile
                          )
                        }
                        className="h-12 w-full bg-[#008B99] font-semibold disabled:text-[#A4A7AE] rounded-[8px] disabled:bg-[#F5F5F5] disabled:border-[#E9EAEB]"
                      >
                        Approve Investment
                      </Button>
                    </Form>
                  </div>
                  <div className="space-y-6">
                    <div className="border border-[#E9EAEB] bg-white p-5 rounded-[8px]">
                      <h2 className="text-[#414651] text-[18px] font-semibold mb-2">
                        Investment Type
                      </h2>
                      <p className="text-[#535862] mb-4 text-sm">
                        <span className="font-bold text-[#181D27]">
                          One-time:
                        </span>{" "}
                        You Invest the full amount upfront. Locked for the
                        chosen duration.
                      </p>
                      <p className="text-[#535862] text-sm">
                        <span className="font-bold text-[#181D27]">
                          Recurring:
                        </span>{" "}
                        You commit a total amount, and the system spreads it
                        into daily debits over the chosen duration.
                      </p>
                    </div>

                    <div className="border border-[#E9EAEB] bg-white p-5 rounded-[8px]">
                      <h2 className="text-[#414651] text-[18px] font-semibold mb-2">
                        Investment Categories
                      </h2>
                      <p className="text-[#535862] mb-4 text-sm">
                        <span className="font-bold text-[#181D27]">
                          Conservative ETF:
                        </span>{" "}
                        Lower risk, diversified across BTC, ETH, and stable
                        assets.
                      </p>
                      <p className="text-[#535862] mb-4 text-sm">
                        <span className="font-bold text-[#181D27]">
                          Bitcoin ETF:
                        </span>{" "}
                        Medium risk, fully concentrated in Bitcoin.
                      </p>
                      <p className="text-[#535862] text-sm">
                        <span className="font-bold text-[#181D27]">
                          Growth ETF:
                        </span>{" "}
                        Higher risk, includes altcoins like ETH, SOL, DOGE.
                      </p>
                    </div>
                  </div>
                </div>
              </TooltipProvider>
            );
          }}
        </Formik>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="hidden">Open</DialogTrigger>
        <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px]">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <span className="size-12 rounded-full bg-[#DCFAE6 flex justtify-center items-center]">
                <Image
                  src={"/assets/images/dashboard/check-circle.svg"}
                  alt={"check-circle"}
                  width={20}
                  height={20}
                />
              </span>
            </div>
            <DialogTitle className="text-[#181D27] font-semibold text-center mb-[2px]">
              Investment Approved Successfully
            </DialogTitle>
            <DialogDescription className="text-[#535862] text-center text-sm">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Link
              href="/dashboard/investments"
              className="w-full block px-4 text-center py-2.5 bg-[#008B99] rounded-[8px] text-white font-semibold"
            >
              Back to Investments
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
