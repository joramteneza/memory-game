"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const schema = z.object({
    anonymousId: z.string().min(3, "Username must be at least 3 characters"),
});

type FormData = z.infer<typeof schema>;

type SubmitFormProps = {
    score: number;
    onClose: () => void;
    onPlay: () => void;
};

export default function SubmitForm({ score, onClose, onPlay }: SubmitFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            await axios.post("/api/scores/anonymous", { anonymousId: data.anonymousId, score });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting score", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-transparent p-6 rounded-lg shadow-xl text-white max-w-md mx-auto">
            {isSubmitted ? (
                <div className="text-center">
                    <h2 className="text-xl font-bold"></h2>
                    <DialogHeader className="flex items-center justify-center">
                        <DialogTitle>🎉 Score Submitted!</DialogTitle>
                    </DialogHeader>
                    <p className="flex items-center justify-center gap-1.5">Your score: <span className="text-green-400 font-semibold">{score.toFixed(2)} seconds</span></p>
                    <div className="flex flex-col gap-2 mt-4">
                        <Button
                            onClick={onPlay}
                            variant="outline"
                            size="lg"
                            className="cursor-pointer bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                        >
                            Play Again
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Button
                        onClick={onClose}
                        type="button"
                        variant="outline"
                        className="cursor-pointer w-fit bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                    >
                        🔙 Go Back
                    </Button>
                    <DialogHeader className="flex items-center justify-center">
                        <DialogTitle>✅ Submit Your Score</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="anonymousId">Enter an Anonymous Name</Label>
                        <Input
                            id="anonymousId"
                            {...register("anonymousId")}
                            placeholder="Your name"
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                        {errors.anonymousId && (
                            <p className="text-red-400 text-sm">{errors.anonymousId.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="outline"
                        className="cursor-pointer bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Score"}
                    </Button>
                </form>
            )}
        </div>
    );
}
