'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { login } from '@/services/auth';
import styles from './login.module.scss';
import AuthTitle from '@/components/authTitle';
import Input from '@/components/input';
import Button from '@/components/button';

const EmailIcon = 'assets/icons/email.svg';
const LockIcon = 'assets/icons/lock.svg';
const EyeIcon = 'assets/icons/eye.svg';
const RightIcon = 'assets/icons/right.svg';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let validationErrors = {};
        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.email = 'Invalid email address';
        }

        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const res = await login({ email, password });
            if (res && res.status === 1) {
                const token = res.data?.access_token || res.data?.accessToken || res.data?.token;
                const refreshToken = res.data?.refresh_token || res.data?.refreshToken;
                
                const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

                // Save access token in cookie (valid for 7 days)
                if (token) {
                    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                }
                
                // Save refresh token in cookie (valid for 30 days)
                if (refreshToken) {
                    document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; path=/; max-age=2592000; SameSite=Lax${isSecure ? '; Secure' : ''}`;
                }
                
                toast.success(res.message || 'Logged in successfully');
                router.push('/dashboard');
            } else {
                toast.error(res?.message || 'Login failed');
                setIsLoading(false);
            }
        } catch (err) {
            // Error notification is handled by the api.js request wrapper,
            // we just reset the loading state.
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.auth}>
            <div className={styles.contentBox}>
                <div className={styles.information}>
                    <AuthTitle title='Sign in as Admin' />
                    <form onSubmit={handleSubmit}>
                        <div className={styles.col}>
                            <div>
                                <Input
                                    rightSpacingRemove
                                    leftIcon={EmailIcon}
                                    label='Email'
                                    placeholder='hijuyed@gmail.com'
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                            </div>
                            <div>
                                <Input
                                    rightIcon={EyeIcon}
                                    leftIcon={LockIcon}
                                    label='Password'
                                    placeholder='• • • • • • • • • • '
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onRightIconClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                />
                                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={isLoading} 
                            text={isLoading ? "Signing in..." : "Sign in"} 
                            icon={RightIcon} 
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
