import styles from './login.module.scss';
import AuthTitle from '@/components/authTitle';
import Input from '@/components/input';
import Button from '@/components/button';
const EmailIcon = 'assets/icons/email.svg';
const LockIcon = 'assets/icons/lock.svg';
const EyeIcon = 'assets/icons/eye.svg';
const RightIcon = 'assets/icons/right.svg';
export default function Login() {
    return (
        <div className={styles.auth}>
            <div className={styles.contentBox}>
                <div className={styles.information}>
                    <AuthTitle title='Sign in as Admin' />
                    <div className={styles.col}>
                        <Input rightSpacingRemove leftIcon={EmailIcon} label='Email' placeholder='hijuyed@gmail.com' />
                        <Input rightIcon={EyeIcon} leftIcon={LockIcon} label='Password' placeholder='• • • • • • • • • • ' />
                    </div>

                    <Button text="Sign in" icon={RightIcon} />
                </div>
            </div>
        </div>
    )
}
