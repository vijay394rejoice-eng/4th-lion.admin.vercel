import React from 'react'
import styles from './minimumWithdraw.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
const RightIcon = 'assets/icons/right.svg';
const CloseIcon = 'assets/icons/close.svg';
export default function MinimumWithdraw() {
    return (
        <div className={styles.minimumWithdraw}>
            <Input label='Set Minimum Deposit Amount' placeholder="$5" spacingRemove />
            <div className={styles.buttonGrid}>
                <Button text="Save" icon={RightIcon} />
                <Button text="Cancel" icon={CloseIcon} primaryOutline />
            </div>
        </div>
    )
}
