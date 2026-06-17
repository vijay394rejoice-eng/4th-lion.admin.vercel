import React from 'react'
import styles from './profitShareSetup.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
const RightIcon = 'assets/icons/right.svg';
const CloseIcon = 'assets/icons/close.svg';
export default function ProfitShareSetup() {
    return (
        <div className={styles.profitShareSetup}>
            <Input label='Investor' spacingRemove placeholder='50%' />
            <Input label='IB' spacingRemove placeholder='10%' />
            <Input label='Company' spacingRemove placeholder='40%' />
            <Input label='Broker Commissions' spacingRemove placeholder='$5' />
            <div className={styles.buttonGrid}>
                <Button text="Send" icon={RightIcon} />
                <Button text="Cancel" icon={CloseIcon} primaryOutline />
            </div>
        </div>
    )
}
