"use client";

import { verifyOtpAction } from "@/actions/verify-otp-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@midday/supabase/client";
import { Button } from "@midday/ui/button";
import { cn } from "@midday/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@midday/ui/form";
import { Input } from "@midday/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@midday/ui/input-otp";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {
  className?: string;
};

export function OTPSignIn({ className }: Props) {
  const verifyOtp = useAction(verifyOtpAction);

  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    data: email,
    mutate: onSubmit,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: ({ email }: z.infer<typeof formSchema>) =>
      supabase.auth.signInWithOtp({ email }).then(() => email),
  });

  async function onComplete(token: string) {
    if (!email) return;

    verifyOtp.execute({
      token,
      email,
    });
  }

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col space-y-4 items-center", className)}>
        <InputOTP
          maxLength={6}
          autoFocus
          onComplete={onComplete}
          disabled={verifyOtp.status === "executing"}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot
                  key={index.toString()}
                  {...slot}
                  className="w-[62px] h-[62px]"
                />
              ))}
            </InputOTPGroup>
          )}
        />

        <div className="flex space-x-2">
          <span className="text-sm text-[#878787]">
            Didn't receive the email?
          </span>
          <button
            type="button"
            className="text-sm text-primary underline font-medium"
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => onSubmit(d))}>
        <div className={cn("flex flex-col space-y-4", className)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter email address"
                    {...field}
                    autoCapitalize="false"
                    autoCorrect="false"
                    spellCheck="false"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
