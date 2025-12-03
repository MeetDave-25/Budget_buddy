import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Mail, RefreshCw } from 'lucide-react';

interface OTPVerificationScreenProps {
    email: string;
    onVerified: () => void;
    onBack: () => void;
}

export function OTPVerificationScreen({ email, onVerified, onBack }: OTPVerificationScreenProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 7) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 8 digits are entered
        if (newOtp.every(digit => digit !== '') && index === 7) {
            verifyOTP(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 8);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('').concat(Array(8 - pastedData.length).fill(''));
        setOtp(newOtp);

        // Focus last filled input or verify if complete
        if (pastedData.length === 8) {
            verifyOTP(pastedData);
        } else {
            inputRefs.current[pastedData.length]?.focus();
        }
    };

    const verifyOTP = async (code: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: 'signup',
            });

            if (error) throw error;

            toast.success('Email verified successfully! 🎉');
            onVerified();
        } catch (error: any) {
            toast.error(error.message || 'Invalid verification code');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) throw error;

            toast.success('New verification code sent!');
            setCountdown(60);
            setCanResend(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
                        >
                            <Mail className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                        <p className="text-sm text-muted-foreground">
                            We sent a 8-digit code to
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">{email}</p>
                    </div>

                    <div className="space-y-6">
                        {/* OTP Input */}
                        <div className="flex flex-wrap justify-center gap-2" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={() => verifyOTP(otp.join(''))}
                            disabled={loading || otp.some(d => !d)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>

                        {/* Resend Section */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?
                            </p>
                            <Button
                                variant="ghost"
                                onClick={handleResend}
                                disabled={!canResend || resendLoading}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {resendLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : canResend ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Resend OTP
                                    </>
                                ) : (
                                    `Resend OTP (${countdown}s)`
                                )}
                            </Button>
                        </div>

                        {/* Back Button */}
                        <div className="text-center">
                            <button
                                onClick={onBack}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Wrong email? Go back
                            </button>
                        </div>
                    </div>
                </Card>

                <div className="text-center mt-6">
                    <p className="text-xs text-muted-foreground">
                        Made By <span className="font-semibold text-foreground">Meet G. Dave</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
