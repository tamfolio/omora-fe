"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Balances from "./Balances";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Step = "investmentType" | InvestmentType;
type InvestmentType = "recurring" | "one-time" | null;

interface FormValues {
  investment: InvestmentType;
  dailyDeductionAmount: number | null;
  lockedLiquidity: number | null;
  conservativeProfile: number | null;
  termsAndConditions: boolean;
  oneTimeAmount: number | null;
  bitcoinProfile: number | null;
  growthProfile: number | null;
  portfolioType: "recommended" | "custom";
}

const validationSchema = Yup.object({
  investment: Yup.string()
    .nullable()
    .required("Please select an investment type"),
  dailyDeductionAmount: Yup.number()
    .nullable()
    .when("investment", {
      is: "recurring",
      then: (schema) =>
        schema
          .required("Daily deduction is required")
          .min(1, "Must be greater than 0"),
    }),
  lockedLiquidity: Yup.number()
    .nullable()
    .when("investment", {
      is: "recurring",
      then: (schema) =>
        schema
          .required("Locked liquidity is required")
          .min(1, "Must be greater than 0")
          .test(
            "min-10-percent",
            "Locked Liquidity must be at least 10% of Daily Deduction",
            function (value) {
              const { dailyDeductionAmount } = this.parent;
              if (!dailyDeductionAmount || !value) return true;
              return value >= dailyDeductionAmount * 0.1;
            }
          ),
    }),
  conservativeProfile: Yup.string()
    .nullable()
    .when("investment", {
      is: "recurring",
      then: (schema) => schema.required("Please select a portfolio type"),
    }),
  termsAndConditions: Yup.boolean().oneOf([true], "You must accept the risks"),
});

export default function CreateInvestmentMultiStepForm() {
  const [step, setStep] = useState<Step>("investmentType");
  const [isOpen, setIsOpen] = useState(false);

  const initialValues: FormValues = {
    investment: null,
    dailyDeductionAmount: null,
    lockedLiquidity: null,
    conservativeProfile: null,
    termsAndConditions: false,
    oneTimeAmount: null,
    bitcoinProfile: null,
    growthProfile: null,
    portfolioType: "recommended",
  };

  const handleNext = (values: FormValues) => {
    if (values.investment === "recurring") {
      setStep("recurring");
    } else if (values.investment === "one-time") {
      setStep("one-time");
    }
  };

  function LockedLiquidityEffect({
    dailyDeductionAmount,
    setFieldValue,
  }: {
    dailyDeductionAmount: number;
    setFieldValue: (field: string, value: number | null) => void;
  }) {
    useEffect(() => {
      if (dailyDeductionAmount) {
        const locked = Math.floor(dailyDeductionAmount * 0.1);
        setFieldValue("lockedLiquidity", locked);
      } else {
        setFieldValue("lockedLiquidity", null);
      }
    }, [dailyDeductionAmount, setFieldValue]);

    return null;
  }

  return (
    <div className="relative h-full bg-gradient-to-b from-[#79B7BC]/5 via-[#AEDCE0]/5 to-[#FFFFFF] px-[112px]">
      <div className={`${step !== "investmentType" ? "lg:px-[95px]" : "pb-10"}`}>
        {step === "investmentType" ? (
          <div className="text-center pt-24 mb-20">
            <h2 className="text-[#181D27] text-[48px] font-semibold mb-1">
              Investment
            </h2>
            <p className="text-[#535862] text-[20px]">
              Select your preferred Investment type
            </p>
          </div>
        ) : (
          <div className="pt-16">
            <Balances />
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={true}
          enableReinitialize
          validateOnChange={false}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
            setIsOpen(true);
          }}
        >
          {({
            values,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
          }) => {
            return (
              <Form>
                <LockedLiquidityEffect
                  dailyDeductionAmount={values.dailyDeductionAmount as number}
                  setFieldValue={setFieldValue}
                />
                <LockedLiquidityEffect
                  dailyDeductionAmount={values.dailyDeductionAmount as number}
                  setFieldValue={setFieldValue}
                />
                {step === "investmentType" && (
                  <div className="flex flex-col justify-center items-center gap-10">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                      {/* Recurring Investment Card */}
                      <div
                        onClick={() => setFieldValue("investment", "recurring")}
                        className={cn(
                          "w-[306px] bg-white rounded-[8px] h-[229px] px-4 py-2.5 border cursor-pointer transition",
                          values.investment === "recurring"
                            ? "border-[#008B99]"
                            : "border-[#E9EAEB] hover:border-[#008B99]/50"
                        )}
                      >
                        <h2 className="text-[#414651] font-semibold text-[24px]">
                          Recurring Investment
                        </h2>
                        <p className="text-[18px] text-[#535862] mt-2">
                          Invest small amounts at regular intervals. This
                          spreads out risk and smooths out market ups and downs.
                        </p>
                      </div>

                      {/* One-time Investment Card */}
                      <div
                        onClick={() => setFieldValue("investment", "one-time")}
                        className={cn(
                          "w-[306px] bg-white rounded-[8px] h-[229px] px-4 py-2.5 border cursor-pointer transition",
                          values.investment === "one-time"
                            ? "border-[#008B99]"
                            : "border-[#E9EAEB] hover:border-[#008B99]/50"
                        )}
                      >
                        <h2 className="text-[#414651] font-semibold text-[24px]">
                          One-time Investment
                        </h2>
                        <p className="text-[18px] text-[#535862] mt-2">
                          Invest a lump sum all at once. Higher potential
                          returns if the market rises, but carries more risk.
                        </p>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <Button
                      type="button"
                      disabled={!values.investment}
                      onClick={() => handleNext(values)}
                      className={cn(
                        "w-[400px] rounded-[8px] h-11 text-white transition",
                        values.investment
                          ? "bg-[#008B99] hover:bg-[#007680]"
                          : "bg-[#F5F5F5] border border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                      )}
                    >
                      Continue
                    </Button>

                    <Button className="absolute right-[63px] bottom-[110px] p-0 size-10 rounded-[5px] bg-[#008B99] hover:bg-[#007680]">
                      <Image
                        className="size-5"
                        src="/assets/images/dashboard/investment/support.svg"
                        width={21}
                        height={21}
                        alt="support"
                      />
                    </Button>
                  </div>
                )}

                {step === "recurring" && (
                  <div className="mt-10">
                    <h2 className="text-[#181D27] font-semibold text-[30px] mb-4">
                      Recurring Investment
                    </h2>
                    <Tabs
                      defaultValue="current-risk-profile"
                      className="justify-center"
                      onValueChange={(val) =>
                        setFieldValue(
                          "portfolioType",
                          val === "override" ? "custom" : "recommended"
                        )
                      }
                    >
                      <TabsList className="flex-wrap p-0 h-fit !bg-none border rounded-[8px] w-full md:flex-nowrap md:w-fit border-[#E9EAEB]">
                        <TabsTrigger
                          className="w-full lg:w-[352px] text-[#414651] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] data-[state=active]:rounded-[8px]"
                          value="current-risk-profile"
                        >
                          My Current Risk Profile (Conservative)
                        </TabsTrigger>
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <TabsTrigger
                              className="w-full md:w-[352px] text-[#414651] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] data-[state=active]:rounded-[8px]"
                              value="override"
                            >
                              Overide and go use custom
                            </TabsTrigger>
                          </DialogTrigger>
                          <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="text-[#414651] font-bold text-[24px] text-center">
                                Custom Reccurring Investment
                              </DialogTitle>
                              <DialogDescription className="text-[#535862] text-sm text-center">
                                Please select any of the investment category
                                that is much more preferable to youavailable to
                                you.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    CONSERVATIVE
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    Bitcoin, Ethereum, Solana, Dodge, Ripple
                                    (XRP)
                                  </p>
                                </div>
                                <Checkbox
                                  name="conservativeProfileInvestment"
                                  checkColor="white"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] border-[#D5D7DA] rounded-[4px]"
                                  id="conservativeProfileInvestment"
                                />
                              </div>
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    BITCOIN ETF
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    You only wanted to invest on Bitcoin
                                  </p>
                                </div>
                                <Checkbox
                                  name="bitcoinProfileInvestment"
                                  checkColor="white"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] border-[#D5D7DA] rounded-[4px]"
                                  id="bitcoinProfileInvestment"
                                />
                              </div>
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    GROWTH
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    You are very Aggressive and would like to
                                    invest on Bitcoin, Ethereum, Solana, Dodge,
                                    Ripple (XRP)
                                  </p>
                                </div>
                                <Checkbox
                                  checkColor="white"
                                  name="growthProfileInvestment"
                                  // stroke="2"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] data-[state=checked]:text-white border-[#D5D7DA] rounded-[4px]"
                                  id="growthProfileInvestment"
                                />
                              </div>
                              <Button className="w-full bg-[#008B99] mt-2 h-11 rounded-[8px] font-semibold text-white">
                                Continue
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TabsList>
                      <TabsContent value="current-risk-profile">
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8 mb-[128px]">
                          <div className="bg-white h-fit p-6 border border-[#E9EAEB] rounded-[12px] space-y-[23px]">
                            <div>
                              <label
                                htmlFor="dailyDeductionAmount"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Amount to be deducted daily
                              </label>
                              <Field
                                placeholder="250"
                                min={0}
                                onChange={(e: { target: { value: number } }) =>
                                  setFieldValue(
                                    "dailyDeductionAmount",
                                    e.target.value
                                  )
                                }
                                as={Input}
                                type="number"
                                name="dailyDeductionAmount"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.dailyDeductionAmount &&
                                    touched.dailyDeductionAmount
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="dailyDeductionAmount"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="lockedLiquidity"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Locked Liquidity (USDT) (10%)
                              </label>
                              <div className="relative flex flex-col items-center justify-center">
                                <Field
                                  as={Input}
                                  placeholder="25"
                                  min={0}
                                  value={values.lockedLiquidity ?? ""}
                                  readOnly
                                  type="number"
                                  name="lockedLiquidity"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.lockedLiquidity &&
                                      touched.lockedLiquidity
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="lockedLiquidity"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="conservativeProfile"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Conservative Profile
                              </label>
                              <div className="relative flex flex-col items-center justify-center">
                                <Field
                                  as={Input}
                                  placeholder="25"
                                  min={0}
                                  type="number"
                                  name="conservativeProfile"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.conservativeProfile &&
                                      touched.conservativeProfile
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="conservativeProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            <div>
                              <div className="flex items-start gap-2">
                                <Checkbox
                                  name="termsAndConditions"
                                  checked={values.termsAndConditions}
                                  onCheckedChange={(e: boolean) =>
                                    setFieldValue("termsAndConditions", e)
                                  }
                                  className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                                  id="termsAndConditions"
                                />
                                <div className="grid gap-2 -m-[2px]">
                                  <label
                                    htmlFor="termsAndConditions"
                                    className="hidden"
                                  >
                                    Accept terms and conditions
                                  </label>
                                  <p className="text-[#414651] text-sm">
                                    I understand this is a cryptocurrency
                                    investment and accept the associated risks,
                                    including potential capital loss due to
                                    market volatility
                                  </p>
                                </div>
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
                                !values.conservativeProfile ||
                                !values.dailyDeductionAmount ||
                                !values.investment ||
                                !values.lockedLiquidity ||
                                !values.termsAndConditions
                              }
                              className="h-12 w-full bg-[#008B99] ring-2 ring-offset-2 disabled:ring-0 ring-[#9E77ED] font-semibold disabled:text-[#A4A7AE] rounded-[8px] disabled:bg-[#F5F5F5] disabled:border-[#E9EAEB]"
                            >
                              Approve Investment
                            </Button>
                          </div>
                          <div className="bg-[#E5FAFC] h-fit rounded-[10px] p-6">
                            <h2 className="text-[#99A0AF] mb-3 text-[24px] font-semibold text-center">
                              Omora Recommendations
                            </h2>
                            <div className="bg-[url(/assets/images/dashboard/investment/recommendation-bg.png)] bg-contain bg-white bg-no-repeat border border-[#DDDEE1] min-h-[367px] mb-1 rounded-[4px] px-5 py-4">
                              <p className="text-[#535862] text-sm">
                                Describe your project in as much detail as you
                                can comfortably reveal - Tell us about the
                                vision for your company and how you want our
                                products to help you achieve your vision. You
                                can speak to us using [microphone] if it&apos;s
                                easier.{" "}
                              </p>
                              <ul className="ml-4 text-[#535862] space-y-3 mt-3">
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="override">
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8 mb-[128px]">
                          <div className="bg-white p-6 h-fit border border-[#E9EAEB] rounded-[12px] space-y-[23px]">
                            {/* Daily Deduction */}
                            <div>
                              <label
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                                htmlFor="dailyDeductionAmount"
                              >
                                Amount to be deducted daily
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="dailyDeductionAmount"
                                placeholder="250"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.dailyDeductionAmount &&
                                    touched.dailyDeductionAmount
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="dailyDeductionAmount"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            {/* Locked Liquidity */}
                            <div>
                              <label
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                                htmlFor="lockedLiquidity"
                              >
                                Locked Liquidity (USDT) (10%)
                              </label>
                              <div className="relative">
                                <Field
                                  as={Input}
                                  type="number"
                                  name="lockedLiquidity"
                                  placeholder="25"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.lockedLiquidity &&
                                      touched.lockedLiquidity
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 top-2 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="lockedLiquidity"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            {/* Choose ETF */}
                            <div>
                              <label
                                htmlFor="conservativeProfile"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Conservative ETF
                              </label>
                              <div className="relative flex flex-col items-center justify-center">
                                <Field
                                  as={Input}
                                  placeholder="Quantity"
                                  min={0}
                                  type="number"
                                  name="conservativeProfile"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.conservativeProfile &&
                                      touched.conservativeProfile
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="conservativeProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="bitcoinProfile"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Bitcoin ETF
                              </label>
                              <div className="relative flex flex-col items-center justify-center">
                                <Field
                                  as={Input}
                                  placeholder="Quantity"
                                  min={0}
                                  type="number"
                                  name="bitcoinProfile"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.bitcoinProfile &&
                                      touched.bitcoinProfile
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="bitcoinProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="growthProfile"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Growth ETF
                              </label>
                              <div className="relative flex flex-col items-center justify-center">
                                <Field
                                  as={Input}
                                  placeholder="Quantity"
                                  min={0}
                                  type="number"
                                  name="growthProfile"
                                  className={cn(
                                    "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                    errors.growthProfile &&
                                      touched.growthProfile
                                      ? "border-[#F04438]"
                                      : ""
                                  )}
                                />
                                <span className="absolute right-3.5 text-[#717680]">
                                  USDC
                                </span>
                              </div>
                              <ErrorMessage
                                name="growthProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>
                            {/* Terms */}
                            <div className="flex gap-2">
                              <Checkbox
                                checked={values.termsAndConditions}
                                onCheckedChange={(checked: boolean) =>
                                  setFieldValue("termsAndConditions", checked)
                                }
                                className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                                id="termsAndConditions"
                              />
                              <div className="grid gap-2 -m-[2px]">
                                <label
                                  htmlFor="termsAndConditions"
                                  className="hidden"
                                >
                                  Accept terms and conditions
                                </label>
                                <p className="text-[#414651] text-sm">
                                  I understand this is a cryptocurrency
                                  investment and accept the associated risks,
                                  including potential capital loss due to market
                                  volatility
                                </p>
                              </div>
                            </div>
                            <ErrorMessage
                              name="termsAndConditions"
                              component="div"
                              className="text-[#F04438] text-sm mt-1"
                            />
                            <Button
                              type="submit"
                              disabled={
                                isSubmitting ||
                                !values.conservativeProfile ||
                                !values.dailyDeductionAmount ||
                                !values.investment ||
                                !values.lockedLiquidity ||
                                !values.termsAndConditions
                              }
                              className="h-12 w-full bg-[#008B99] ring-2 ring-offset-2 disabled:ring-0 ring-[#9E77ED] font-semibold disabled:text-[#A4A7AE] rounded-[8px] disabled:bg-[#F5F5F5] disabled:border-[#E9EAEB]"
                            >
                              Approve Investment
                            </Button>
                          </div>

                          <div className="bg-[#E5FAFC] h-fit rounded-[10px] p-6">
                            <h2 className="text-[#99A0AF] mb-3 text-[24px] font-semibold text-center">
                              Omora Recommendations
                            </h2>
                            <div className="bg-[url(/assets/images/dashboard/investment/recommendation-bg.png)] bg-contain bg-white bg-no-repeat border border-[#DDDEE1] min-h-[367px] mb-1 rounded-[4px] px-5 py-4">
                              <p className="text-[#535862] text-sm">
                                Describe your project in as much detail as you
                                can comfortably reveal - Tell us about the
                                vision for your company and how you want our
                                products to help you achieve your vision. You
                                can speak to us using [microphone] if it&apos;s
                                easier.{" "}
                              </p>
                              <ul className="ml-4 text-[#535862] space-y-3 mt-3">
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px]">
                                      Conservative ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862]">
                                        200 USDC{" "}
                                      </span>
                                      (60% Bitcoin, 15% Ethereum, 5% Solana, 5%
                                      Dodge, 5% Ripple (XRP)){" "}
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px] text-nowrap">
                                      Bitcoin ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862] w-[206px]">
                                        200 USDC{" "}
                                      </span>
                                      (100% Bitcoin){" "}
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px] text-nowrap">
                                      Growth ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862] w-[206px]">
                                        200 USDC{" "}
                                      </span>
                                      (15% Ethereum, 5% Solana, 5% Dodge, 5%
                                      XRP, ){" "}
                                    </span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {step === "one-time" && (
                  <div className="mt-10">
                    <h2 className="text-[#181D27] font-semibold text-[30px] mb-4">
                      One-time Investment
                    </h2>
                    <Tabs
                      defaultValue="current-risk-profile"
                      className="justify-center"
                      onValueChange={(val) =>
                        setFieldValue(
                          "portfolioType",
                          val === "override" ? "custom" : "recommended"
                        )
                      }
                    >
                      <TabsList className="flex-wrap p-0 h-fit !bg-none border rounded-[8px] w-full md:flex-nowrap md:w-fit border-[#E9EAEB]">
                        <TabsTrigger
                          className="w-full lg:w-[352px] text-[#414651] data-[state=active]:bg-white data-[state=active]:border bg-[#FAFAFA] data-[state=active]:rounded-[8px]"
                          value="current-risk-profile"
                        >
                          My Current Risk Profile (Conservative)
                        </TabsTrigger>
                        <Dialog>
                          <DialogTrigger className="w-full">
                            <TabsTrigger
                              className="w-full md:w-[352px] text-[#414651] data-[state=active]:bg-white data-[state=active]:border bg-[#FAFAFA] data-[state=active]:rounded-[8px]"
                              value="override"
                            >
                              Override and use custom
                            </TabsTrigger>
                          </DialogTrigger>
                          <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px]">
                            <DialogHeader>
                              <DialogTitle className="text-[#414651] font-bold text-[24px] text-center">
                                Custom Reccurring Investment
                              </DialogTitle>
                              <DialogDescription className="text-[#535862] text-sm text-center">
                                Please select any of the investment category
                                that is much more preferable to youavailable to
                                you.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    CONSERVATIVE
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    Bitcoin, Ethereum, Solana, Dodge, Ripple
                                    (XRP)
                                  </p>
                                </div>
                                <Checkbox
                                  name="conservativeProfileInvestment"
                                  checkColor="white"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] border-[#D5D7DA] rounded-[4px]"
                                  id="conservativeProfileInvestment"
                                />
                              </div>
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    BITCOIN ETF
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    You only wanted to invest on Bitcoin
                                  </p>
                                </div>
                                <Checkbox
                                  name="bitcoinProfileInvestment"
                                  checkColor="white"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] border-[#D5D7DA] rounded-[4px]"
                                  id="bitcoinProfileInvestment"
                                />
                              </div>
                              <div className="border border-[#E9EAEB] rounded-[12px] flex items-center justify-between gap-2 px-4 py-3">
                                <div className="pl-[15px]">
                                  <h3 className="text-[#535862] font-semibold text-sm mb-1">
                                    GROWTH
                                  </h3>
                                  <p className="text-[#535862] text-xs">
                                    You are very Aggressive and would like to
                                    invest on Bitcoin, Ethereum, Solana, Dodge,
                                    Ripple (XRP)
                                  </p>
                                </div>
                                <Checkbox
                                  checkColor="white"
                                  name="growthProfileInvestment"
                                  // stroke="2"
                                  // checked={values.termsAndConditions}
                                  // onCheckedChange={(e: boolean) =>
                                  //   setFieldValue("termsAndConditions", e)
                                  // }
                                  className="border mr-[15px] size-4 data-[state=checked]:bg-[#008B99] data-[state=checked]:text-white border-[#D5D7DA] rounded-[4px]"
                                  id="growthProfileInvestment"
                                />
                              </div>
                              <Button className="w-full bg-[#008B99] mt-2 h-11 rounded-[8px] font-semibold text-white">
                                Continue
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TabsList>

                      {/* Recommended */}
                      <TabsContent value="current-risk-profile">
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8 mb-[128px]">
                          <div className="bg-white p-6 h-fit border border-[#E9EAEB] rounded-[12px] space-y-[23px]">
                            {/* Amount */}
                            <div>
                              <label
                                htmlFor="oneTimeAmount"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                One-time Amount
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="oneTimeAmount"
                                placeholder="500"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.oneTimeAmount && touched.oneTimeAmount
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="oneTimeAmount"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>

                            {/* Conservative Profile */}
                            <div>
                              <label
                                htmlFor="conservativeProfile"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                Conservative Profile
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="conservativeProfile"
                                placeholder="200"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.conservativeProfile &&
                                    touched.conservativeProfile
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="conservativeProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
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
                                <p className="text-[#414651] text-sm">
                                  I understand this is a cryptocurrency
                                  investment and accept the associated risks.
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
                                !values.oneTimeAmount ||
                                !values.conservativeProfile ||
                                !values.termsAndConditions
                              }
                              className="h-12 w-full bg-[#008B99] ring-2 ring-offset-2 disabled:ring-0 ring-[#9E77ED] font-semibold disabled:text-[#A4A7AE] rounded-[8px] disabled:bg-[#F5F5F5] disabled:border-[#E9EAEB]"
                            >
                              Approve Investment
                            </Button>
                          </div>

                          {/* Recommendations box */}
                          <div className="bg-[#E5FAFC] h-fit rounded-[10px] p-6">
                            <h2 className="text-[#99A0AF] mb-3 text-[24px] font-semibold text-center">
                              Omora Recommendations
                            </h2>
                            <div className="bg-[url(/assets/images/dashboard/investment/recommendation-bg.png)] bg-contain bg-white bg-no-repeat border border-[#DDDEE1] min-h-[367px] mb-1 rounded-[4px] px-5 py-4">
                              <p className="text-[#535862] text-sm">
                                Describe your project in as much detail as you
                                can comfortably reveal - Tell us about the
                                vision for your company and how you want our
                                products to help you achieve your vision. You
                                can speak to us using [microphone] if it&apos;s
                                easier.{" "}
                              </p>
                              <ul className="ml-4 text-[#535862] space-y-3 mt-3">
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex gap-1">
                                    <span className="font-semibold block w-fit text-nowrap">
                                      Bitcoin (BTC) :
                                    </span>
                                    <span className="">
                                      <span className="font-semibold text-[#535862]">
                                        20 USDC{" "}
                                      </span>
                                      (60% of allocated token)
                                    </span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Custom */}
                      <TabsContent value="override">
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mt-8 mb-[128px]">
                          <div className="bg-white p-6 h-fit border border-[#E9EAEB] rounded-[12px] space-y-[23px]">
                            {/* Amount */}
                            <div>
                              <label
                                htmlFor="oneTimeAmount"
                                className="block font-medium text-[#414651] text-sm mb-1.5"
                              >
                                One-time Amount
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="oneTimeAmount"
                                placeholder="500"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.oneTimeAmount && touched.oneTimeAmount
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="oneTimeAmount"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>

                            {/* Conservative ETF */}
                            <div>
                              <label className="block font-medium text-[#414651] text-sm mb-1.5">
                                Conservative ETF
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="conservativeProfile"
                                placeholder="Quantity"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.conservativeProfile &&
                                    touched.conservativeProfile
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="conservativeProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>

                            {/* Bitcoin ETF */}
                            <div>
                              <label className="block font-medium text-[#414651] text-sm mb-1.5">
                                Bitcoin ETF
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="bitcoinProfile"
                                placeholder="Quantity"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.bitcoinProfile &&
                                    touched.bitcoinProfile
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="bitcoinProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>

                            {/* Growth ETF */}
                            <div>
                              <label className="block font-medium text-[#414651] text-sm mb-1.5">
                                Growth ETF
                              </label>
                              <Field
                                as={Input}
                                type="number"
                                name="growthProfile"
                                placeholder="Quantity"
                                className={cn(
                                  "border p-2 w-full rounded-[8px] border-[#D5D7DA] placeholder:text-[#717680] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                  errors.growthProfile && touched.growthProfile
                                    ? "border-[#F04438]"
                                    : ""
                                )}
                              />
                              <ErrorMessage
                                name="growthProfile"
                                component="div"
                                className="text-[#F04438] text-sm mt-1"
                              />
                            </div>

                            {/* Terms */}
                            <div className="flex gap-2">
                              <Checkbox
                                checked={values.termsAndConditions}
                                onCheckedChange={(checked: boolean) =>
                                  setFieldValue("termsAndConditions", checked)
                                }
                                className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                                id="termsAndConditions"
                              />
                              <p className="text-[#414651] text-sm">
                                I understand this is a cryptocurrency investment
                                and accept the associated risks.
                              </p>
                            </div>
                            <ErrorMessage
                              name="termsAndConditions"
                              component="div"
                              className="text-[#F04438] text-sm mt-1"
                            />

                            <Button
                              type="submit"
                              disabled={
                                isSubmitting ||
                                !values.oneTimeAmount ||
                                (!values.conservativeProfile &&
                                  !values.bitcoinProfile &&
                                  !values.growthProfile) ||
                                !values.termsAndConditions
                              }
                              className="h-12 w-full bg-[#008B99] ring-2 ring-offset-2 disabled:ring-0 ring-[#9E77ED] font-semibold disabled:text-[#A4A7AE] rounded-[8px] disabled:bg-[#F5F5F5] disabled:border-[#E9EAEB]"
                            >
                              Approve Investment
                            </Button>
                          </div>

                          <div className="bg-[#E5FAFC] h-fit rounded-[10px] p-6">
                            <h2 className="text-[#99A0AF] mb-3 text-[24px] font-semibold text-center">
                              Omora Recommendations
                            </h2>
                            <div className="bg-[url(/assets/images/dashboard/investment/recommendation-bg.png)] bg-contain bg-white bg-no-repeat border border-[#DDDEE1] min-h-[367px] mb-1 rounded-[4px] px-5 py-4">
                              <p className="text-[#535862] text-sm">
                                Describe your project in as much detail as you
                                can comfortably reveal - Tell us about the
                                vision for your company and how you want our
                                products to help you achieve your vision. You
                                can speak to us using [microphone] if it&apos;s
                                easier.{" "}
                              </p>
                              <ul className="ml-4 text-[#535862] space-y-3 mt-3">
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px]">
                                      Conservative ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862]">
                                        200 USDC{" "}
                                      </span>
                                      (60% Bitcoin, 15% Ethereum, 5% Solana, 5%
                                      Dodge, 5% Ripple (XRP)){" "}
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px] text-nowrap">
                                      Bitcoin ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862] w-[206px]">
                                        200 USDC{" "}
                                      </span>
                                      (100% Bitcoin){" "}
                                    </span>
                                  </span>
                                </li>
                                <li className="text-sm list-disc">
                                  <span className="flex justify-between gap-1">
                                    <span className="font-semibold block w-[155px] text-nowrap">
                                      Growth ETF:
                                    </span>
                                    <span className="w-[206px]">
                                      <span className="font-semibold text-[#535862] w-[206px]">
                                        200 USDC{" "}
                                      </span>
                                      (15% Ethereum, 5% Solana, 5% Dodge, 5%
                                      XRP, ){" "}
                                    </span>
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Form>
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
              Congratulations
            </DialogTitle>
            <DialogDescription className="text-[#535862] text-sm">
              You&apos;ve committed to a one time investment of $250.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Link
              href="/dashboard/investments"
              className="w-full block px-4 text-center py-2.5 bg-[#008B99] rounded-[8px] text-white font-semibold"
            >
              OK, Take Me to Dashboard
            </Link>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full block px-4 text-center py-2.5 bg-white rounded-[8px] text-[#414651] border border-[#D5D7DA] font-semibold"
            >
              Go Back to Investment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
