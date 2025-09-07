import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown } from "lucide-react";

interface ConvertMoneyProps {
  cta: string;
}

const balances = {
  NGN: 21997.42,
  USDT: 0,
};

const validationSchema = Yup.object().shape({
  receiveAmount: Yup.number()
    .min(1, "Amount must be greater than 0")
    .max(balances.NGN, `You cannot exceed your NGN balance ₦${balances.NGN}`)
    .required("Required"),
  convertAmount: Yup.number()
    .min(1, "Amount must be greater than 0")
    .required("Required"),
  acceptTerms: Yup.boolean().oneOf([true], "You must accept conversion terms"),
});

export default function ConvertMoney({ cta }: ConvertMoneyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rate] = useState(0.0000000637836);
  const conversionFee = 200;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <span className="bg-transparent block hover:bg-transparent text-[#414651] font-semibold p-0 py-2.5 px-3.5 rounded-[8px] w-full border border-[#D5D7DA]">
          {cta}
        </span>
      </DialogTrigger>
      <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[#414651] font-bold text-[24px] text-center">
            Convert Money
          </DialogTitle>
          <DialogDescription className="text-[#535862] text-center mt-1">
            Enter amount and select currency to convert to
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{
            receiveAmount: 0,
            convertAmount: 0,
            acceptTerms: false,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, 2));
            setIsOpen(false);
          }}
        >
          {({
            values,
            isSubmitting,
            errors,
            touched,
            setFieldValue,
          }) => {
            return (
              <Form>
                {/* Receive Section */}
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-[#414651]">
                    Amount you&apos;ll receive{" "}
                    <span className="text-[#008B99]">*</span>
                  </label>
                  <div
                    className={cn(
                      "flex items-center justify-between border rounded-[8px] p-3.5",
                      errors.receiveAmount && touched.receiveAmount
                        ? "border-[#F04438]"
                        : ""
                    )}
                  >
                    <div className="flex gap-1 flex-col items-center text-sm font-medium">
                      <div className="w-full flex items-center">
                        <Image
                          src="/assets/images/dashboard/investment/ng.svg"
                          alt=""
                          height={16}
                          width={20}
                        />{" "}
                        <span className="text-[#717680] text-xs pl-[5px] pr-2">
                          NGN
                        </span>{" "}
                        <ChevronDown color="#717680" size={16} />
                      </div>
                      <p className="text-xs text-[#717680]">
                        Bal: ₦{balances.NGN.toLocaleString()}
                      </p>
                    </div>
                    <Field
                      type="number"
                      name="receiveAmount"
                      className="bg-transparent placeholder:text-[#717680] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <ErrorMessage
                    name="receiveAmount"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Conversion Info */}
                <div className="my-4 text-sm bg-[#FAFAFA] text-[#717680]">
                  <p className="px-3 py-2">Conversion Fee: ₦{conversionFee}</p>
                  <p className="px-3 py-2">
                    Amount we&apos;ll convert: ₦
                    {(values.receiveAmount - conversionFee > 0
                      ? values.receiveAmount - conversionFee
                      : 0
                    ).toLocaleString()}
                  </p>
                  <p className="px-3 py-2">
                    Today&apos;s Rate: #1 = ${rate.toFixed(12)}
                  </p>
                </div>

                {/* Convert Section */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1.5 text-[#414651]">
                    Amount to convert <span className="text-[#008B99]">*</span>
                  </label>
                  <div
                    className={cn(
                      "flex items-center justify-between border rounded-[8px] p-3.5",
                      errors.convertAmount && touched.convertAmount
                        ? "border-[#F04438]"
                        : ""
                    )}
                  >
                    <div className="flex gap-1 flex-col text-sm font-medium">
                      <div className="w-full flex items-center">
                        <Image
                          src="/assets/images/dashboard/investment/usdt.svg"
                          alt="usdt"
                          height={16}
                          width={20}
                        />
                        <span className="text-[#717680] text-xs pl-[5px] pr-2">
                          USDT
                        </span>
                        <ChevronDown color="#717680" size={16} />
                      </div>
                      <p className="text-xs text-[#717680]">
                        Bal: {balances.USDT.toFixed(2)}
                      </p>
                    </div>
                    <Field
                      type="number"
                      name="convertAmount"
                      className="bg-transparent placeholder:text-[#717680] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <ErrorMessage
                    name="convertAmount"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Accept Terms */}
                <div className="mb-10">
                  <div className="flex space-x-2">
                    <Checkbox
                      onCheckedChange={(checked: boolean) =>
                        setFieldValue("acceptTerms", checked)
                      }
                      name="acceptTerms"
                      className="border bg-[#EEF4FF] size-4 data-[state=checked]:bg-[#EEF4FF] border-[#008B99] rounded-[4px]"
                      id="acceptTerms"
                    />
                    <label className="text-sm text-[#414651] -mt-[2px]">
                      I accept the current market conversion rate & fees
                    </label>
                  </div>
                  <ErrorMessage
                    name="acceptTerms"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !values.acceptTerms ||
                    !values.convertAmount ||
                    !values.receiveAmount
                  }
                  className="w-full bg-[#008B99] disabled:bg-[#F5F5F5] disabled:border disabled:border-[#E9EAEB] disabled:text-[#A4A7AE] text-white py-3 px-4.5 rounded-[8px]"
                >
                  Confirm
                </button>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
